import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use("/uploads", express.static("uploads"));

  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend en desarrollo
    credentials: true, // Permitir cookies o tokens si es necesario
  });

  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000);
}
bootstrap();