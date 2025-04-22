import { Module } from '@nestjs/common';
import { UserSoftwareService } from './user-software.service';
import { UserSoftwareController } from './user-software.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SoftwareModule } from '../software/software.module';

@Module({
  imports: [PrismaModule, SoftwareModule],
  controllers: [UserSoftwareController],
  providers: [UserSoftwareService],
  exports: [UserSoftwareService],
})
export class UserSoftwareModule {}