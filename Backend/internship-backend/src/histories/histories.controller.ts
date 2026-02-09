import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { HistoryQueryDto } from './dto/history-query.dto';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.STUDENT,
    UserRole.COMPANY,
    UserRole.SUPERVISOR,
    UserRole.SCHOOL_ADMIN,
  )
  @Get()
  async getHistories(@Req() req, @Query() query: HistoryQueryDto) {
    const filters: Partial<HistoryQueryDto> = {};

    // Filtres depuis la query
    if (query.application_id) filters.application_id = query.application_id;
    if (query.offer_id) filters.offer_id = query.offer_id;
    if (query.status) filters.status = query.status;

    // Filtres selon rôle
    if (req.user.role === UserRole.STUDENT) {
      filters.student_id = req.user.student_id;
    }

    if (req.user.role === UserRole.COMPANY) {
      filters.company_id = req.user.company_id;
    }

    if (req.user.role === UserRole.SUPERVISOR) {
      filters.supervisor_id = req.user.id;
    }
    // SCHOOL_ADMIN : aucun filtre supplémentaire

    return this.historiesService.findAll(filters);
  }
}
