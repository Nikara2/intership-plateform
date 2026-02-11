import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  // Get or create school profile for the logged-in admin
  async getOrCreateProfile(userId: string): Promise<School> {
    let school = await this.schoolRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    // If no profile exists, create a default one
    if (!school) {
      const defaultSchool = this.schoolRepository.create({
        user_id: userId,
        name: 'Mon École',
        description: 'Profil à compléter',
      });
      school = await this.schoolRepository.save(defaultSchool);
    }

    return school;
  }

  // Update school profile
  async updateProfile(userId: string, dto: UpdateSchoolDto): Promise<School> {
    const school = await this.getOrCreateProfile(userId);
    Object.assign(school, dto);
    return this.schoolRepository.save(school);
  }

  // Get all schools (for listing)
  async findAll(): Promise<School[]> {
    return this.schoolRepository.find({ relations: ['user'] });
  }

  // Get school by ID
  async findById(id: string): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  // Delete school
  async remove(id: string): Promise<void> {
    const result = await this.schoolRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('School not found');
  }
}
