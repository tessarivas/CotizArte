// src/art-categories/art-categories.module.ts
import { Module } from '@nestjs/common';
import { ArtCategoriesController } from './art-categories.controller';
import { ArtCategoriesService } from './art-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importa PrismaModule para usar PrismaService
  controllers: [ArtCategoriesController],
  providers: [ArtCategoriesService],
  exports: [ArtCategoriesService], // Opcional: Si otros módulos necesitan usar este servicio
})
export class ArtCategoriesModule {}