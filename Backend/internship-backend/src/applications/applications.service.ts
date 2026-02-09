import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplyDto, ApplicationStatus } from './dto/apply.dto';
import { Offer } from '../offers/offer.entity';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,

    private readonly historiesService: HistoriesService, // service historique
  ) {}

  // 🔹 Candidature d’un étudiant
  async apply(applyDto: ApplyDto): Promise<Application> {
    const offer = await this.offerRepository.findOne({
      where: { id: applyDto.offer_id },
    });

    if (!offer) throw new NotFoundException('Offer not found');

    // Bloquer les candidatures si l’offre est CLOSED
    if (offer.status === 'CLOSED') throw new BadRequestException('This offer is closed');

    // Empêcher les doublons
    const exists = await this.applicationRepository.findOne({
      where: { student_id: applyDto.student_id, offer_id: applyDto.offer_id },
    });
    if (exists) throw new ConflictException('Application already exists');

    const application = this.applicationRepository.create({
      ...applyDto,
      status: ApplicationStatus.PENDING,
    });

    return this.applicationRepository.save(application);
  }

  // 🔹 Toutes les candidatures
  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find({
      relations: ['student', 'offer', 'offer.company'],
    });
  }

  // 🔹 Candidature par ID
  async findById(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['student', 'offer', 'offer.company'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  // 🔹 Candidatures par étudiant
  async findByStudentId(student_id: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { student_id },
      relations: ['offer', 'offer.company'],
    });
  }

  // 🔹 Candidatures par offre
  async findByOfferId(offer_id: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { offer_id },
      relations: ['student', 'offer', 'offer.company'],
    });
  }

  // 🔐 Mettre à jour le statut et enregistrer l’historique si COMPLETED
  async updateStatus(
    id: string,
    status: ApplicationStatus,
    supervisor_user_id: string,
  ): Promise<Application> {
    const application = await this.findById(id);

    // COMPLETED uniquement après ACCEPTED
    if (status === ApplicationStatus.COMPLETED && application.status !== ApplicationStatus.ACCEPTED) {
      throw new BadRequestException(
        'Application must be ACCEPTED before being COMPLETED',
      );
    }

    // Aucune modification possible après COMPLETED
    if (application.status === ApplicationStatus.COMPLETED) {
      throw new BadRequestException('Completed application cannot be modified');
    }

    application.status = status;
    const updated = await this.applicationRepository.save(application);

    // 🔹 Ajouter à l’historique si COMPLETED
    if (status === ApplicationStatus.COMPLETED) {
      await this.historiesService.create({
        application_id: updated.id,
        student_id: updated.student_id,
        offer_id: updated.offer_id,
        company_id: updated.offer.company_id,
        supervisor_id: supervisor_user_id,
        status: ApplicationStatus.COMPLETED,
        applied_at: updated.applied_at,
      });
    }

    return updated;
  }

  // 🔹 Candidatures par user_id étudiant
  async findByStudentUserId(user_id: string): Promise<Application[]> {
    return this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.offer', 'offer')
      .leftJoin('application.student', 'student')
      .where('student.user_id = :user_id', { user_id })
      .getMany();
  }

  // 🔹 Détails d’une candidature avec entreprise
  async findWithCompany(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['offer', 'offer.company', 'student'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  // 🔹 Supprimer une candidature
  async remove(id: string): Promise<void> {
    const result = await this.applicationRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Application not found');
  }
}
