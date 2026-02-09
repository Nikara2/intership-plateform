import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Internship & Student Placement API')
  .setDescription('Backend API for internship management platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
