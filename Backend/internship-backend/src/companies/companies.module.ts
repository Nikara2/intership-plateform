import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './company.entity';
import { Offer } from '../offers/offer.entity';
import { Application } from '../applications/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Offer, Application])],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule {}
