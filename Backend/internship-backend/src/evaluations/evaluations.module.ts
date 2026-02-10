// src/evaluations/evaluations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './evaluation.entity';
import { SupervisorsModule } from '../supervisors/supervisor.module'; // attention au nom exact
import { ApplicationsModule } from '../applications/applications.module'; // si tu utilises ApplicationsService
import { StudentsModule } from '../students/students.module'; // pour StudentsService
import { CompaniesModule } from '../companies/companies.module'; // pour CompaniesService

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation]),
    SupervisorsModule,     // <-- pour injecter SupervisorsService
    ApplicationsModule,    // <-- pour injecter ApplicationsService
    StudentsModule,        // <-- pour injecter StudentsService
    CompaniesModule,       // <-- pour injecter CompaniesService
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
