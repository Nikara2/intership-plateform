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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CompaniesService } from '../companies/companies.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly companiesService: CompaniesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    if (!req.user?.id) throw new Error('Authenticated user information is missing');
    const company = await this.companiesService.findByUserId(req.user.id);
    createOfferDto.company_id = company.id;
    return this.offersService.create(createOfferDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.COMPANY, UserRole.STUDENT)
  @Get()
  async findAll(@Query('company_id') company_id?: string) {
    if (company_id) {
      return this.offersService.findByCompanyId(company_id);
    }
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.COMPANY, UserRole.STUDENT)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.offersService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.offersService.remove(id);
    return { message: 'Offer deleted successfully' };
  }
}
