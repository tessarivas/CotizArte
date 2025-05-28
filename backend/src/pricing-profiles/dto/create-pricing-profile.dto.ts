import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class CreatePricingProfileDto {
  @IsNumber()
  artTypeId: number;

  @IsNumber()
  @IsPositive()
  standardHourlyRate: number;

  @IsNumber()
  @IsPositive()
  preferredHourlyRate: number;

  @IsNumber()
  @IsPositive()
  projectsPerMonth: number;

  @IsNumber()
  @Min(0)
  modificationExtra: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  defaultCommercialLicensePercentage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  defaultUrgencyPercentage: number;
}
