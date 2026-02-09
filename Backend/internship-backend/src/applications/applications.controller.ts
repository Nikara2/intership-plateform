import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplyDto, ApplicationStatus } from './dto/apply.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { StudentsService } from '../students/students.service';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly studentsService: StudentsService,
  ) {}

  // 🔹 Étudiant : ses candidatures
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('me')
  async getMyApplications(@Req() req) {
    return this.applicationsService.findByStudentUserId(req.user.id);
  }

  // 🔹 Étudiant : postuler
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  async apply(@Body() applyDto: ApplyDto, @Req() req) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    const student = await this.studentsService.findByUserId(req.user.id);
    applyDto.student_id = student.id;
    return this.applicationsService.apply(applyDto);
  }

  // 🔹 Admin / Superviseur / Company : consulter
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPERVISOR, UserRole.COMPANY)
  @Get()
  async findAll(
    @Query('student_id') student_id?: string,
    @Query('offer_id') offer_id?: string,
  ) {
    if (student_id) return this.applicationsService.findByStudentId(student_id);
    if (offer_id) return this.applicationsService.findByOfferId(offer_id);
    return this.applicationsService.findAll();
  }

  // 🔹 Admin / Superviseur : voir une candidature
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPERVISOR)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  // 🔹 SUPERVISEUR UNIQUEMENT : changer le statut
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERVISOR)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
    @Req() req,
  ) {
    return this.applicationsService.updateStatus(id, status, req.user.id);
  }

  // 🔹 Admin : suppression
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.applicationsService.remove(id);
    return { message: 'Application deleted successfully' };
  }
}
