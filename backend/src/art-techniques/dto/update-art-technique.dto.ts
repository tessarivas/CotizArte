import { PartialType } from '@nestjs/mapped-types';
import { CreateArtTechniqueDto } from './create-art-technique.dto';

export class UpdateArtTechniqueDto extends PartialType(CreateArtTechniqueDto) {}