// update-quote.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';

export enum QuoteStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class UpdateQuoteDto {
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  commercialLicenseFee?: number; 

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
  finalPrice?: number; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalPriceAfterDiscount?: number; 
}