import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CONFIGURAR CORS PARA VERCEL
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://cotiz-arte.vercel.app', // ✅ TU URL DE VERCEL
      'https://*.vercel.app', // ✅ CUALQUIER SUBDOMINIO DE VERCEL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Aplicación corriendo en puerto ${port}`);
}
bootstrap();