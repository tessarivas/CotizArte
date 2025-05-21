import { PartialType } from '@nestjs/mapped-types';
import { CreateTraditionalToolDto } from './create-traditional-tool.dto';

export class UpdateTraditionalToolDto extends PartialType(CreateTraditionalToolDto) {}
