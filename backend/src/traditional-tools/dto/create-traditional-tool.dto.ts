import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateTraditionalToolDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Type(() => Number)
  averageCost: number;

  @IsNumber()
  @Type(() => Number)
  averageLifespan: number;
}
