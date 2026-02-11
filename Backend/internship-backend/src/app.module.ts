import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { CompaniesModule } from './companies/companies.module';
import { OffersModule } from './offers/offers.module';
import { ApplicationsModule } from './applications/applications.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { AdminModule } from './admin/admin.module';
import { SchoolsModule } from './schools/schools.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    StudentsModule,
    CompaniesModule,
    OffersModule,
    ApplicationsModule,
    EvaluationsModule,
    AdminModule,
    SchoolsModule,
    SettingsModule,
  ],
})
export class AppModule {}
