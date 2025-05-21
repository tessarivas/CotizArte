import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateTraditionalMaterialDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  subCategory: string;

  @IsString()
  quality: string;

  @IsNumber()
  @Type(() => Number)
  averageCost: number;

  @IsString()
  unit: string;
}
