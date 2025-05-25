import { Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTraditionalMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @IsString()
  @IsNotEmpty()
  quality: string;

  @IsNumber()
  @IsNotEmpty()
  averageCost: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @IsOptional()
  containerSize?: number;
}