import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateSoftwareDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Ej: "Adobe Photoshop"

  @IsNumber()
  monthlyCost: number; // Ej: 20.99 (0 si es gratis)

  @IsNumber()
  annualCost: number; // Ej: 239.88

  @IsBoolean()
  hasFreeVersion: boolean; // Ej: false
}