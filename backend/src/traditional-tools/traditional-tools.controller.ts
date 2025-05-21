import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { TraditionalToolsService } from './traditional-tools.service';
import { CreateTraditionalToolDto } from './dto/create-traditional-tool.dto';
import { UpdateTraditionalToolDto } from './dto/update-traditional-tool.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('traditional-tools')
@UseGuards(JwtAuthGuard)
export class TraditionalToolsController {
  constructor(private readonly toolsService: TraditionalToolsService) {}

  @Post()
  create(@Body() dto: CreateTraditionalToolDto, @Req() req: any) {
    return this.toolsService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.toolsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.toolsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTraditionalToolDto, @Req() req: any) {
    return this.toolsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.toolsService.remove(id, req.user.userId);
  }
}
