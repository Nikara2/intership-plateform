import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './application.entity';
import { Offer } from '../offers/offer.entity';
import { HistoriesModule } from '../histories/histories.module';
import { StudentsModule } from '../students/students.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, Offer]), // <-- Offer ajouté ici
    HistoriesModule, // <-- HistoriesService disponible
    StudentsModule, // <-- StudentsService pour dériver student_id du token
    CompaniesModule, // <-- CompaniesService pour vérification ownership
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
