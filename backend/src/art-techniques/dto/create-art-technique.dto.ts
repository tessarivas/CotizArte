import { IsNotEmpty, IsString, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';

export class CreateArtTechniqueDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  artTypeId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string; 

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string; 

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  priceMultiplier: number; 
}