import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',           
      'http://localhost:5173',          
      'https://cotiz-arte.vercel.app',  
      'https://*.vercel.app',           
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With', 
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control'
    ],
    credentials: true,                 
    optionsSuccessStatus: 200         
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
  console.log(`🌐 CORS habilitado para: https://cotiz-arte.vercel.app`);
}

bootstrap();