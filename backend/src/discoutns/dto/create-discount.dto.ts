import { IsString, IsNumber, IsBoolean, IsOptional, IsPositive, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiscountDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  percentage: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDate()
  @Type(() => Date) // Convierte cadenas en objetos Date
  validFrom: Date;

  @IsDate()
  @Type(() => Date) // Convierte cadenas en objetos Date
  validTo: Date;

  @IsNumber()
  userId: number;
}
