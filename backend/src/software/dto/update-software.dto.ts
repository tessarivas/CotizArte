import { PartialType } from '@nestjs/mapped-types';
import { CreateSoftwareDto } from './create-software.dto';
import { IsOptional, IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSoftwareDto extends PartialType(CreateSoftwareDto) {
  @IsOptional()
  @IsString()
  name?: string;

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
