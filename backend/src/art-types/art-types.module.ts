import { Module } from '@nestjs/common';
import { ArtTypesController } from './art-types.controller';
import { ArtTypesService } from './art-types.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtTypesController],
  providers: [ArtTypesService],
  exports: [ArtTypesService], // Para usar el servicio en otros módulos (ej: técnicas de arte)
})
export class ArtTypesModule {}