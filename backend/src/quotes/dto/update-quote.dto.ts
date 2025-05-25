// update-quote.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';

export enum QuoteStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class UpdateQuoteDto {
  // Campos que SÍ existen en la base de datos según tu esquema
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercentage?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  // Precios recalculados
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  commercialLicenseFee?: number; // Este campo SÍ existe en tu BD

  @IsOptional()
  @IsNumber()
  @Min(0)
  urgencyFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  materialsCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  toolsCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalPrice?: number; // Precio antes del descuento

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalPriceAfterDiscount?: number; // Precio final con descuento

  // REMOVIDOS: Los campos que NO existen en la BD
  // isCommercial, commercialPercentage, rapidDeliveryPercentage, 
  // detailLevel, hoursWorked, forceRecalculate
}