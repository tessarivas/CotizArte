import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CommercialLicenseService } from './commercial-license.service';
import { CreateCommercialLicenseDto } from './dto/create-commercial-license.dto';
import { UpdateCommercialLicenseDto } from './dto/update-commercial-license.dto';

@Controller('commercial-license')
export class CommercialLicenseController {
  constructor(private readonly service: CommercialLicenseService) {}

  @Post()
  create(@Body() dto: CreateCommercialLicenseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCommercialLicenseDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
