import { IsNotEmpty, IsString, IsInt, MaxLength, MinLength } from 'class-validator';

export class CreateArtTypeDto {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255, { message: 'La descripción no puede exceder los 255 caracteres' })
  description: string;

  @IsNotEmpty()
  @IsString()
  baseFormula: string;
}