import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluation } from './evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { SupervisorsService } from '../supervisors/supervisor.service';
import { ApplicationsService } from '../applications/applications.service';
import { ApplicationStatus } from '../applications/dto/apply.dto';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly supervisorsService: SupervisorsService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  // 🔹 Créer une évaluation
  async create(
    dto: CreateEvaluationDto,
    supervisor_user_id: string,
  ): Promise<Evaluation> {
    // ❌ Une seule évaluation par candidature
    const exists = await this.evaluationRepository.findOne({
      where: { application_id: dto.application_id },
    });
    if (exists) {
      throw new ConflictException(
        'An evaluation already exists for this application',
      );
    }

    const supervisor =
      await this.supervisorsService.findByUserId(supervisor_user_id);

    const application =
      await this.applicationsService.findWithCompany(dto.application_id);

    // ❌ L'application doit être COMPLETED
    if (application.status !== ApplicationStatus.COMPLETED) {
      throw new BadRequestException(
        'Only COMPLETED applications can be evaluated',
      );
    }

    // ❌ Sécurité entreprise
    if (application.offer.company_id !== supervisor.company_id) {
      throw new ForbiddenException(
        'You cannot evaluate applications outside your company',
      );
    }

    const evaluation = this.evaluationRepository.create({
      ...dto,
      supervisor_id: supervisor.id,
    });

    return this.evaluationRepository.save(evaluation);
  }

  // 🔹 Toutes les évaluations (admin / superviseur)
  async findAll(supervisor_user_id?: string): Promise<Evaluation[]> {
    if (supervisor_user_id) {
      const supervisor =
        await this.supervisorsService.findByUserId(supervisor_user_id);

      return this.evaluationRepository
        .createQueryBuilder('evaluation')
        .leftJoinAndSelect('evaluation.application', 'application')
        .leftJoinAndSelect('application.offer', 'offer')
        .leftJoinAndSelect('offer.company', 'company')
        .leftJoinAndSelect('application.student', 'student')
        .where('company.id = :companyId', {
          companyId: supervisor.company_id,
        })
        .getMany();
    }

    return this.evaluationRepository.find({
      relations: [
        'application',
        'application.offer',
        'application.student',
        'application.offer.company',
      ],
    });
  }

  // 🔹 Une évaluation par ID
  async findById(
    id: string,
    supervisor_user_id?: string,
  ): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: [
        'application',
        'application.offer',
        'application.student',
        'application.offer.company',
      ],
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluation not found');
    }

    if (supervisor_user_id) {
      const supervisor =
        await this.supervisorsService.findByUserId(supervisor_user_id);

      if (
        evaluation.application.offer.company_id !== supervisor.company_id
      ) {
        throw new ForbiddenException(
          'You cannot access evaluations outside your company',
        );
      }
    }

    return evaluation;
  }

  // 🔹 Évaluations d’un étudiant (historique futur)
  async findByStudentId(student_id: string): Promise<Evaluation[]> {
    return this.evaluationRepository.find({
      where: { application: { student_id } },
      relations: [
        'application',
        'application.offer',
        'application.offer.company',
      ],
    });
  }

  // 🔹 Mise à jour (superviseur)
  async update(
    id: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    const evaluation = await this.findById(id);
    Object.assign(evaluation, updateEvaluationDto);
    return this.evaluationRepository.save(evaluation);
  }

  // 🔹 Suppression (admin)
  async remove(id: string): Promise<void> {
    const result = await this.evaluationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Evaluation not found');
    }
  }
}
