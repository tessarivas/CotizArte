// create-quote.dto.ts
import { IsInt, IsNumber, IsPositive, IsString, IsOptional, Max, IsIn, Min } from 'class-validator';

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

  // Arrays opcionales para IDs de recursos seleccionados
  selectedSoftwareIds?: number[];
  selectedDigitalToolIds?: number[];
  selectedTraditionalMaterialIds?: number[];
  selectedTraditionalToolIds?: number[];

  // ===== VALORES CALCULADOS DESDE EL FRONTEND =====
  // Estos valores vienen ya calculados desde useQuotePreview
  // Nota: shippingFee y certificateFee están incluidos en basePrice
  
  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(0)
  commercialFee: number;

  @IsNumber()
  @Min(0)
  urgencyFee: number;

  @IsNumber()
  @Min(0)
  materialsCost: number;

  @IsNumber()
  @Min(0)
  toolsCost: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  total: number;

  // Campos para referencia (no se guardan en DB pero pueden venir del frontend)
  @IsNumber()
  @Min(0)
  @IsOptional()
  shippingFee?: number;

  @IsNumber()
  @Min(0)  
  @IsOptional()
  certificateFee?: number;
}