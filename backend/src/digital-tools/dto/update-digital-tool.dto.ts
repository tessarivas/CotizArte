import { PartialType } from '@nestjs/mapped-types';
import { CreateDigitalToolDto } from './create-digital-tool.dto';

export class UpdateDigitalToolDto extends PartialType(CreateDigitalToolDto) {}
