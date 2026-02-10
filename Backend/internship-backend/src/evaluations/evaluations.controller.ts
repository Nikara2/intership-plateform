import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StudentsService } from '../students/students.service';

@Controller('evaluations')
export class EvaluationsController {
  constructor(
    private readonly evaluationsService: EvaluationsService,
    private readonly studentsService: StudentsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('me')
  async getMyEvaluations(@Req() req) {
    // Get student from user_id
    const student = await this.studentsService.findByUserId(req.user.id);
    return this.evaluationsService.findByStudentId(student.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERVISOR, UserRole.COMPANY)
  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto, @Req() req) {
    return this.evaluationsService.create(createEvaluationDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPERVISOR, UserRole.COMPANY)
  @Get()
  async findAll(@Req() req) {
    if (req.user.role === UserRole.SUPERVISOR || req.user.role === UserRole.COMPANY)
      return this.evaluationsService.findAll(req.user);
    return this.evaluationsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPERVISOR)
  @Get(':id')
  async findById(@Param('id') id: string, @Req() req) {
    if (req.user.role === UserRole.SUPERVISOR)
      return this.evaluationsService.findById(id, req.user.id);
    return this.evaluationsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERVISOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationsService.update(id, updateEvaluationDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.evaluationsService.remove(id);
    return { message: 'Evaluation deleted successfully' };
  }
}
