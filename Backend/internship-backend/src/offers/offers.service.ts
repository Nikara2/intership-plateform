import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = this.offerRepository.create({
      ...createOfferDto,
      status: 'OPEN',
    });
    return this.offerRepository.save(offer);
  }

  // 🔹 Mise à jour automatique des offres expirées
  private async closeExpiredOffers(): Promise<void> {
    await this.offerRepository.update(
      {
        deadline: LessThan(new Date()),
        status: 'OPEN',
      },
      { status: 'CLOSED' },
    );
  }

  async findAll(): Promise<Offer[]> {
    await this.closeExpiredOffers();
    return this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .loadRelationCountAndMap('offer._count.applications', 'offer.applications')
      .getMany();
  }

  async findById(id: string): Promise<Offer> {
    await this.closeExpiredOffers();
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async findByCompanyId(company_id: string): Promise<Offer[]> {
    await this.closeExpiredOffers();
    return this.offerRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.company', 'company')
      .where('offer.company_id = :company_id', { company_id })
      .loadRelationCountAndMap('offer._count.applications', 'offer.applications')
      .getMany();
  }

  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findById(id);
    Object.assign(offer, updateOfferDto);
    return this.offerRepository.save(offer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.offerRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Offer not found');
  }
}
