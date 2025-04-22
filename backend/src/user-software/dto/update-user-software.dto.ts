import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSoftwareDto } from './create-user-software.dto';

export class UpdateUserSoftwareDto extends PartialType(CreateUserSoftwareDto) {}