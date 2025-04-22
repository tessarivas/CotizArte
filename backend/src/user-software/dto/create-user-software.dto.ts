import { IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateUserSoftwareDto {
  @IsOptional()
  @IsNumber()
  softwareId?: number; // Solo requerido si no es custom

  @ValidateIf(o => !o.softwareId)
  @IsString()
  customName?: string; // Requerido si softwareId no está

  @IsBoolean()
  isCustom: boolean;

  @IsString()
  licenseType: string;

  @IsNumber()
  actualCost: number;
}