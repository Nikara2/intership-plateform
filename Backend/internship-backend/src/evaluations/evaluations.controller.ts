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

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('me')
  async getMyEvaluations(@Req() req) {
    return this.evaluationsService.findByStudentId(req.user.student_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERVISOR)
  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto, @Req() req) {
    return this.evaluationsService.create(createEvaluationDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPERVISOR)
  @Get()
  async findAll(@Req() req) {
    if (req.user.role === UserRole.SUPERVISOR)
      return this.evaluationsService.findAll(req.user.id);
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
