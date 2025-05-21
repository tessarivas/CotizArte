// create-quote.dto.ts
import { IsInt, IsNumber, IsPositive, IsString, IsOptional, Max, IsIn } from 'class-validator';

export class CreateQuoteDto {
  @IsInt()
  @IsPositive()
  projectId: number;

  @IsInt()
  @IsPositive()
  @IsIn([1, 2, 3, 4]) // Validar que sea uno de los tipos conocidos
  artTypeId: number;

  @IsNumber()
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  clientId?: number;

  selectedSoftwareIds?: number[];
  selectedDigitalToolIds?: number[];
  selectedTraditionalMaterialIds?: number[];
  selectedTraditionalToolIds?: number[];
}