import { Module } from '@nestjs/common';
import { SoftwareService } from './software.service';
import { SoftwareController } from './software.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SoftwareController],
  providers: [SoftwareService],
  exports: [SoftwareService], // Para usarlo en otros módulos (ej: UserSoftware)
})
export class SoftwareModule {}