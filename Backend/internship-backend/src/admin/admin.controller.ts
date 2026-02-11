import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SCHOOL_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/applications-by-month')
  async getApplicationsByMonth(@Query('months') months: string = '6') {
    return this.adminService.getApplicationsByMonth(parseInt(months));
  }

  @Get('stats/internships-by-sector')
  async getInternshipsBySector() {
    return this.adminService.getInternshipsBySector();
  }

  @Get('activities/recent')
  async getRecentActivities(@Query('limit') limit: string = '10') {
    return this.adminService.getRecentActivities(parseInt(limit));
  }
}
