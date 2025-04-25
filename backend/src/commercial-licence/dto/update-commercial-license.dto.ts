import { PartialType } from '@nestjs/mapped-types';
import { CreateCommercialLicenseDto } from './create-commercial-license.dto';

export class UpdateCommercialLicenseDto extends PartialType(CreateCommercialLicenseDto) {}