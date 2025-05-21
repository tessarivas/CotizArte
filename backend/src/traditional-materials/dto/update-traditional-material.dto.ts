import { PartialType } from '@nestjs/mapped-types';
import { CreateTraditionalMaterialDto } from './create-traditional-material.dto';

export class UpdateTraditionalMaterialDto extends PartialType(CreateTraditionalMaterialDto) {}
