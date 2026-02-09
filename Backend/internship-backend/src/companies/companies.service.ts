import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Offer } from '../offers/offer.entity';
import { Application } from '../applications/application.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string): Promise<Company> {
    const company = this.companyRepository.create({
      ...createCompanyDto,
      user_id: userId,
    });
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({ relations: ['user'] });
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findByUserId(user_id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { user_id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findById(id);
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  // ✅ Nouvelle méthode pour update via le user connecté (PATCH /me)
  async updateByUserId(user_id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findByUserId(user_id);
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Company not found');
  }

  async getCompanyStats(user_id: string) {
    const company = await this.findByUserId(user_id);

    // Get all offers for this company
    const offers = await this.offerRepository.find({
      where: { company_id: company.id },
    });

    const offerIds = offers.map(o => o.id);

    // Get all applications for these offers
    const applications = offerIds.length > 0
      ? await this.applicationRepository
          .createQueryBuilder('application')
          .leftJoinAndSelect('application.student', 'student')
          .leftJoinAndSelect('application.offer', 'offer')
          .where('application.offer_id IN (:...offerIds)', { offerIds })
          .getMany()
      : [];

    // Calculate stats
    const activeOffers = offers.filter(o => o.status === 'OPEN').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'PENDING').length;
    const acceptedApplications = applications.filter(a => a.status === 'ACCEPTED').length;

    // Get recent applications (last 5)
    const recentApplications = applications
      .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
      .slice(0, 5);

    // Add application counts to active offers
    const activeOffersWithCounts = offers
      .filter(o => o.status === 'OPEN')
      .slice(0, 3)
      .map(offer => ({
        ...offer,
        _count: {
          applications: applications.filter(a => a.offer_id === offer.id).length,
        },
      }));

    return {
      activeOffers,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      completionRate: totalApplications > 0
        ? Math.round((acceptedApplications / totalApplications) * 100)
        : 0,
      recentApplications,
      activeOffersData: activeOffersWithCounts,
    };
  }
}
