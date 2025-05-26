import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CONFIGURAR CORS PARA PRODUCCIÓN
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'https://tu-app.vercel.app', // ✅ CAMBIARÁS ESTO DESPUÉS
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  
  // ✅ USAR PUERTO DE RENDER O 3000
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // ✅ IMPORTANTE: 0.0.0.0 para Render
  
  console.log(`🚀 Aplicación corriendo en puerto ${port}`);
}
bootstrap();