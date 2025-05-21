import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSoftwareDto {
  @IsString()
  name: string;

  @IsOptional() // Solo se valida si se envía
  @IsNumber()
  @Type(() => Number)
  monthlyCost?: number;

  @IsOptional() // Solo se valida si se envía
  @IsNumber()
  @Type(() => Number)
  annualCost?: number;

  @IsBoolean()
  @Type(() => Boolean)
  hasFreeVersion: boolean;
}
