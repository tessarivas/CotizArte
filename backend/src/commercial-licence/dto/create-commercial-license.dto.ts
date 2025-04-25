import { IsString, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateCommercialLicenseDto {
  @IsString()
  @MaxLength(50) // Limita el tamaño del nombre para evitar entradas largas
  name: string;

  @IsString()
  @MaxLength(255) // Limita el tamaño de la descripción
  description: string;

  @IsNumber()
  @IsPositive() // Asegura que el porcentaje sea un número positivo
  percentageIncrease: number;
}
