import { 
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { SoftwareService } from './software.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Req } from '@nestjs/common';

@Controller('software')
@UseGuards(JwtAuthGuard)
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post()
  create(@Body() dto: CreateSoftwareDto, @Req() req: any) {
    // req.user.id debe existir aquí
    console.log('req.user:', req.user);
    return this.softwareService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.softwareService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.softwareService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSoftwareDto,
    @Req() req: any
  ) {
    return this.softwareService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.softwareService.remove(id, req.user.userId);
  }
}
