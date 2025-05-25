import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TraditionalMaterialsService } from './traditional-materials.service';
import { CreateTraditionalMaterialDto } from './dto/create-traditional-material.dto';
import { UpdateTraditionalMaterialDto } from './dto/update-traditional-material.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('traditional-materials')
@UseGuards(JwtAuthGuard)
export class TraditionalMaterialsController {
  constructor(private readonly materialsService: TraditionalMaterialsService) {}

  @Post()
  create(@Body() dto: CreateTraditionalMaterialDto, @Req() req: any) {
    return this.materialsService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.materialsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.materialsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTraditionalMaterialDto, @Req() req: any) {
    return this.materialsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.materialsService.remove(id, req.user.userId);
  }
}
