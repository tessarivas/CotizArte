import { Module } from '@nestjs/common';
import { PricingProfilesService } from './pricing-profiles.service';
import { PricingProfilesController } from './pricing-profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingProfilesController],
  providers: [PricingProfilesService],
  exports: [PricingProfilesService], // Para usarlo en Projects/Quotes
})
export class PricingProfilesModule {}