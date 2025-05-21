import { IsInt, IsPositive, IsOptional, Min } from 'class-validator';

export class CreatePricingProfileDto {
  @IsInt()
  artTypeId: number;

  @IsPositive()
  standardHourlyRate: number;

  @IsPositive()
  preferredHourlyRate: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  projectsPerMonth?: number;

  @IsOptional()
  defaultCommercialLicensePercentage?: number;

  @IsOptional()
  defaultUrgencyPercentage?: number;

  @IsOptional()
  @Min(0)
  modificationExtra?: number;
}
