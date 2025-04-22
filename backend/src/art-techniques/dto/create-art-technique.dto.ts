import { IsNotEmpty, IsString, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';

export class CreateArtTechniqueDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  artTypeId: number; // ID del tipo de arte (ej: Pintura)

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string; // Ej: "Óleo", "Acrílico"

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string; // Descripción opcional

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  priceMultiplier: number; // Ej: 1.2 (aumenta el precio base en 20%)
}