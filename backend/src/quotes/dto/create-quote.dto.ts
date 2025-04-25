// create-quote.dto.ts
import { IsInt, IsNumber, IsPositive, IsString, IsOptional, Max } from 'class-validator';

export class CreateQuoteDto {
  @IsInt()
  @IsPositive()
  projectId: number;

  @IsInt()
  @IsPositive()
  artTypeId: number;

  @IsNumber()
  @IsPositive()
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}