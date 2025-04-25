import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";

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