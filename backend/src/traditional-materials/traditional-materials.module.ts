import { Module } from '@nestjs/common';
import { TraditionalMaterialsService } from './traditional-materials.service';
import { TraditionalMaterialsController } from './traditional-materials.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TraditionalMaterialsController],
  providers: [TraditionalMaterialsService],
  exports: [TraditionalMaterialsService],
})
export class TraditionalMaterialsModule {}
