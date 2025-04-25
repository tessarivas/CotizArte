import { Module } from '@nestjs/common';
import { CommercialLicenseService } from './commercial-license.service';
import { CommercialLicenseController } from './commercial-license.controller';

@Module({
  controllers: [CommercialLicenseController],
  providers: [CommercialLicenseService],
})
export class CommercialLicenseModule {}
