import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly jwtService: JwtService,
  ) {}

  // ---------------------------
  // REGISTER
  // ---------------------------
  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const { email, password, role } = registerDto;

    // STUDENT and SUPERVISOR cannot self-register, they must be created by their organization
    if (role === UserRole.STUDENT || role === UserRole.SUPERVISOR) {
      throw new ConflictException('This role cannot self-register');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ email, password: hashedPassword, role });
    const savedUser = await this.userRepository.save(user);

    // Créer automatiquement un profil d'entreprise pour les utilisateurs COMPANY
    if (role === UserRole.COMPANY) {
      const companyName = email.split('@')[0] || 'Ma Société';
      const company = this.companyRepository.create({
        user_id: savedUser.id,
        name: companyName.charAt(0).toUpperCase() + companyName.slice(1),
        description: 'Profil à compléter',
      });
      await this.companyRepository.save(company);
    }

    const { password: _, ...result } = savedUser;
    return result;
  }

  // ---------------------------
  // VALIDATE USER (LOGIN)
  // ---------------------------
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  // ---------------------------
  // CHANGE PASSWORD
  // ---------------------------
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
