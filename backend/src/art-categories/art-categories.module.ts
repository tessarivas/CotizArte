// src/art-categories/art-categories.module.ts
import { Module } from '@nestjs/common';
import { ArtCategoriesController } from './art-categories.controller';
import { ArtCategoriesService } from './art-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [ArtCategoriesController],
  providers: [ArtCategoriesService],
  exports: [ArtCategoriesService], 
})
export class ArtCategoriesModule {}