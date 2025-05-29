import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSoftwareDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  version?: string; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value === null || value === undefined ? 0 : Number(value))
  monthlyCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => value === null || value === undefined ? 0 : Number(value))
  annualCost?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  hasFreeVersion?: boolean;
}
