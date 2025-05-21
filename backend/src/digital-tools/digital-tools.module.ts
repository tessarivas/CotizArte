import { Module } from '@nestjs/common';
import { DigitalToolsService } from './digital-tools.service';
import { DigitalToolsController } from './digital-tools.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DigitalToolsController],
  providers: [DigitalToolsService],
  exports: [DigitalToolsService],
})
export class DigitalToolsModule {}
