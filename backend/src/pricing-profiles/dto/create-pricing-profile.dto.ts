import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreatePricingProfileDto {
  @IsInt()
  @IsPositive()
  artTypeId: number;

  @IsNumber()
  @IsPositive()
  standardHourlyRate: number;

  @IsNumber()
  @IsPositive()
  preferredHourlyRate: number;

  @IsInt()
  @IsPositive()
  projectsPerMonth: number;
}