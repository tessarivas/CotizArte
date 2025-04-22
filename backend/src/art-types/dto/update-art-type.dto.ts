import { PartialType } from '@nestjs/mapped-types';
import { CreateArtTypeDto } from './create-art-type.dto';

export class UpdateArtTypeDto extends PartialType(CreateArtTypeDto) {}