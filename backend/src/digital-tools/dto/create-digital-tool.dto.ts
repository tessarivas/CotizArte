import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateDigitalToolDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  averageCost: number;

  @IsNumber()
  @Type(() => Number)
  averageLifespan: number;
}
