// src/art-categories/dto/update-art-category.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtCategoryDto } from './create-art-category.dto';

export class UpdateArtCategoryDto extends PartialType(CreateArtCategoryDto) {}