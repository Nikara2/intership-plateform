// src/supervisors/supervisors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supervisor } from './supervisor.entity';
import { SupervisorsService } from './supervisor.service';
import { SupervisorsController } from './supervisor.controller';
import { CompaniesModule } from '../companies/companies.module';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supervisor, User]), CompaniesModule],
  controllers: [SupervisorsController],
  providers: [SupervisorsService],
  exports: [SupervisorsService],
})
export class SupervisorsModule {}
