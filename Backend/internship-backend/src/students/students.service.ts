import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { User } from '../users/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Création d’un profil étudiant
  async create(dto: CreateStudentDto, userId: string): Promise<Student> {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: UserRole.STUDENT },
    });
    if (!user) throw new NotFoundException('Student user not found');

    const student: Student = this.studentRepository.create({
      ...dto,
      user,
      cv_url: dto.cv_url ?? undefined,
    });

    return this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({ relations: ['user'] });
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!student) throw new NotFoundException('Student profile not found');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findById(id);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  // ✅ Nouvelle méthode pour update via le user connecté (PATCH /me)
  async updateByUserId(userId: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findByUserId(userId);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  async updateCv(studentId: string, cvPath: string): Promise<Student> {
    const student = await this.findById(studentId);
    student.cv_url = cvPath;
    return await this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Student not found');
  }
}
