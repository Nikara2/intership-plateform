import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: { id: string; email?: string; role?: UserRole };
}

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY, UserRole.SCHOOL_ADMIN)
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: CustomRequest) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    return this.companiesService.create(createCompanyDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.COMPANY)
  @Get()
  async findAll() {
    return this.companiesService.findAll();
  }

  // Profil de l'entreprise connectée
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Get('me')
  async getMyProfile(@Req() req: CustomRequest) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    return this.companiesService.findByUserId(req.user.id);
  }

  // Statistiques du dashboard
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Get('me/stats')
  async getMyStats(@Req() req: CustomRequest) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    return this.companiesService.getCompanyStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.COMPANY)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Get(':id/detailed')
  async findDetailedById(@Param('id') id: string) {
    return this.companiesService.findDetailedById(id);
  }

  // Mise à jour du profil de l’entreprise connectée
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch('me')
  async updateMyProfile(@Req() req: CustomRequest, @Body() dto: UpdateCompanyDto) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    return this.companiesService.updateByUserId(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.companiesService.remove(id);
    return { message: 'Company deleted successfully' };
  }

  // Endpoint temporaire pour créer un profil d'entreprise pour l'utilisateur connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post('setup-profile')
  async setupProfile(@Req() req: CustomRequest) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');

    // Vérifier si l'entreprise existe déjà
    try {
      const existing = await this.companiesService.findByUserId(req.user.id);
      return { message: 'Company profile already exists', company: existing };
    } catch (error) {
      // L'entreprise n'existe pas, la créer
      const companyName = req.user.email?.split('@')[0] || 'Ma Société';
      const company = await this.companiesService.create(
        {
          name: companyName.charAt(0).toUpperCase() + companyName.slice(1),
          description: 'Profil à compléter',
        },
        req.user.id
      );
      return { message: 'Company profile created successfully', company };
    }
  }
}
