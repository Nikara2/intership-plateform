import {
  Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req,
} from '@nestjs/common';
import { SupervisorsService } from './supervisor.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { CreateSupervisorWithUserDto } from './dto/create-supervisor-with-user.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CompaniesService } from '../companies/companies.service';

@Controller('supervisors')
export class SupervisorsController {
  constructor(
    private readonly supervisorsService: SupervisorsService,
    private readonly companiesService: CompaniesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post('create-with-user')
  async createWithUser(@Body() dto: CreateSupervisorWithUserDto, @Req() req) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    const company = await this.companiesService.findByUserId(req.user.id);
    return this.supervisorsService.createWithUser(dto, company.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post()
  async create(@Body() dto: CreateSupervisorDto, @Req() req) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    const company = await this.companiesService.findByUserId(req.user.id);
    dto.company_id = company.id;
    return this.supervisorsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Get()
  async findAll(@Query('company_id') company_id?: string) {
    return this.supervisorsService.findAll(company_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.supervisorsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSupervisorDto) {
    return this.supervisorsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.supervisorsService.remove(id);
    return { message: 'Supervisor deleted successfully' };
  }
}
