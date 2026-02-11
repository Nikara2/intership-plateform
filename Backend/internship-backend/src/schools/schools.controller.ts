import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // Get profile of the logged-in school admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Get('me')
  async getMyProfile(@Req() req) {
    return this.schoolsService.getOrCreateProfile(req.user.id);
  }

  // Update profile of the logged-in school admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN)
  @Patch('me')
  async updateMyProfile(@Req() req, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.updateProfile(req.user.id, dto);
  }

  // Get all schools (could be used by other admins or for listing)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.schoolsService.findAll();
  }
}
