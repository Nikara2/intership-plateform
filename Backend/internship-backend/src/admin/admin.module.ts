import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Student } from '../students/student.entity';
import { Company } from '../companies/company.entity';
import { Offer } from '../offers/offer.entity';
import { Application } from '../applications/application.entity';
import { Evaluation } from '../evaluations/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Company, Offer, Application, Evaluation]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
