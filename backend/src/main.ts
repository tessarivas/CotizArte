import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // ✅ AGREGAR
import { join } from 'path'; // ✅ AGREGAR

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ✅ CAMBIAR TIPO
  
  // ✅ CONFIGURAR ARCHIVOS ESTÁTICOS
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // ✅ CONFIGURAR CORS PARA VERCEL
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://cotiz-arte.vercel.app',
      'https://*.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Aplicación corriendo en puerto ${port}`);
  console.log(`📁 Archivos estáticos servidos desde /uploads`);
}
bootstrap();