import { Module } from '@nestjs/common';
import { ArtTechniquesService } from './art-techniques.service';
import { ArtTechniquesController } from './art-techniques.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtTechniquesController],
  providers: [ArtTechniquesService],
  exports: [ArtTechniquesService], 
})
export class ArtTechniquesModule {}