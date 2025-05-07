// backend/src/projects/dto/create-project.dto.ts
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProjectDto {
  @IsInt()
  @IsPositive()
  artTypeId: number;

  @IsInt()
  @IsOptional()
  artTechniqueId?: number;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  detailLevel: number;

  @IsNumber()
  @IsPositive()
  hoursWorked: number;

  @IsBoolean()
  isCommercial: boolean;

  @IsBoolean()
  @IsOptional()
  rapidDelivery?: boolean;

  @IsInt()
  @IsOptional()
  @IsPositive()
  clientId?: number;
}

// Especialización: Digital Illustration
export class DigitalIllustrationDto {
  @IsString()
  illustrationType: string;

  @IsNumber()
  additionalModifications: number;

  @IsNumber()
  modificationCost: number;
}

// Especialización: Video Editing
export class VideoEditingDto {
  @IsString()
  editingType: string;

  @IsNumber()
  stockFootageCost: number;

  @IsNumber()
  musicSoundCost: number;

  @IsNumber()
  pluginsCost: number;

  @IsInt()
  includedRevisions: number;

  @IsInt()
  additionalRevisions: number;

  @IsNumber()
  revisionCost: number;
}

// Especialización: Painting
export class PaintingDto {
  @IsString()
  technique: string;

  @IsNumber()
  canvasPaperCost: number;

  @IsNumber()
  paintsCost: number;

  @IsNumber()
  finishingCost: number;

  @IsNumber()
  framingCost: number;

  @IsBoolean()
  shipping: boolean;

  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @IsBoolean()
  authenticityCertificate: boolean;

  @IsOptional()
  @IsNumber()
  certificateCost?: number;
}

// Especialización: Drawing
export class DrawingDto {
  @IsString()
  technique: string;

  @IsNumber()
  paperCost: number;

  @IsNumber()
  materialsCost: number;

  @IsNumber()
  finishingCost: number;

  @IsNumber()
  framingCost: number;

  @IsBoolean()
  shipping: boolean;

  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @IsBoolean()
  authenticityCertificate: boolean;

  @IsOptional()
  @IsNumber()
  certificateCost?: number;
}

// DTO final extendido
export class CreateProjectCompleteDto extends CreateProjectDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DigitalIllustrationDto)
  digitalIllustration?: DigitalIllustrationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoEditingDto)
  videoEditing?: VideoEditingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaintingDto)
  painting?: PaintingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DrawingDto)
  drawing?: DrawingDto;
}