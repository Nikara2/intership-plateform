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
  ],
})
export class AppModule {}
