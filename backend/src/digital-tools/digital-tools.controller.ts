import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { DigitalToolsService } from './digital-tools.service';
import { CreateDigitalToolDto } from './dto/create-digital-tool.dto';
import { UpdateDigitalToolDto } from './dto/update-digital-tool.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('digital-tools')
@UseGuards(JwtAuthGuard)
export class DigitalToolsController {
  constructor(private readonly digitalToolsService: DigitalToolsService) {}

  @Post()
  create(@Body() dto: CreateDigitalToolDto, @Req() req: any) {
    return this.digitalToolsService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.digitalToolsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.digitalToolsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDigitalToolDto, @Req() req: any) {
    return this.digitalToolsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.digitalToolsService.remove(id, req.user.userId);
  }
}
