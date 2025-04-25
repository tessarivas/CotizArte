import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingProfileDto } from './create-pricing-profile.dto';

export class UpdatePricingProfileDto extends PartialType(CreatePricingProfileDto) {}