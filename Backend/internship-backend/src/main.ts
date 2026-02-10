import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration - Allow all localhost origins in development
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Allow all localhost origins in development
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }

      // Allow specific production origins here
      const allowedOrigins = [
        'https://your-production-domain.com',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Internship & Student Placement API')
    .setDescription('API documentation for Internship & Student Placement Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
