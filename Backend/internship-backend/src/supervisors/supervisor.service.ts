import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supervisor } from './supervisor.entity';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { CreateSupervisorWithUserDto } from './dto/create-supervisor-with-user.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SupervisorsService {
  constructor(
    @InjectRepository(Supervisor)
    private readonly supervisorRepository: Repository<Supervisor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateSupervisorDto): Promise<Supervisor> {
    // Validate that user exists
    const user = await this.userRepository.findOne({ where: { id: dto.user_id } });
    if (!user) throw new NotFoundException('User not found');

    // Validate that user has SUPERVISOR role
    if (user.role !== UserRole.SUPERVISOR) {
      throw new BadRequestException('User must have SUPERVISOR role');
    }

    // Check for duplicate supervisor
    const exists = await this.supervisorRepository.findOne({
      where: { user_id: dto.user_id },
    });
    if (exists) throw new ConflictException('Supervisor already exists for this user');

    const supervisor = this.supervisorRepository.create(dto);
    return this.supervisorRepository.save(supervisor);
  }

  async createWithUser(
    dto: CreateSupervisorWithUserDto,
    company_id: string,
  ): Promise<{ user: User; supervisor: Supervisor }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if email already exists
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: dto.email },
      });
      if (existingUser) throw new ConflictException('Email already in use');

      // Create user with SUPERVISOR role
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      const user = queryRunner.manager.create(User, {
        email: dto.email,
        password: hashedPassword,
        role: UserRole.SUPERVISOR,
      });
      const savedUser = await queryRunner.manager.save(user);

      // Create supervisor linked to company
      const supervisor = queryRunner.manager.create(Supervisor, {
        user_id: savedUser.id,
        company_id,
        full_name: dto.full_name,
        is_active: true,
      });
      const savedSupervisor = await queryRunner.manager.save(supervisor);

      await queryRunner.commitTransaction();

      return { user: savedUser, supervisor: savedSupervisor };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(company_id?: string): Promise<Supervisor[]> {
    if (company_id) {
      return this.supervisorRepository.find({
        where: { company_id },
        relations: ['user', 'company'],
      });
    }
    return this.supervisorRepository.find({ relations: ['user', 'company'] });
  }

  async findById(id: string): Promise<Supervisor> {
    const sup = await this.supervisorRepository.findOne({
      where: { id },
      relations: ['user', 'company'],
    });
    if (!sup) throw new NotFoundException('Supervisor not found');
    return sup;
  }

  async update(id: string, dto: UpdateSupervisorDto): Promise<Supervisor> {
    const sup = await this.findById(id);
    Object.assign(sup, dto);
    return this.supervisorRepository.save(sup);
  }

  async findByUserId(user_id: string): Promise<Supervisor> {
    const sup = await this.supervisorRepository.findOne({
      where: { user_id },
      relations: ['company', 'user'],
    });
    if (!sup) throw new NotFoundException('Supervisor not found');
    return sup;
  }

  async remove(id: string): Promise<void> {
    const result = await this.supervisorRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Supervisor not found');
  }
}
