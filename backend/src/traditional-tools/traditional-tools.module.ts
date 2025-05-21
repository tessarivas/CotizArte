import { Module } from '@nestjs/common';
import { TraditionalToolsService } from './traditional-tools.service';
import { TraditionalToolsController } from './traditional-tools.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TraditionalToolsController],
  providers: [TraditionalToolsService],
  exports: [TraditionalToolsService],
})
export class TraditionalToolsModule {}
