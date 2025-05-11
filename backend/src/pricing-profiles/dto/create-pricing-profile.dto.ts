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
  projectsPerMonth?: number; // Permite valores opcionales

  @IsOptional()
  defaultCommercialLicensePercentage?: number;

  @IsOptional()
  defaultUrgencyPercentage?: number;
}
