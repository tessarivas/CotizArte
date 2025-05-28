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

  // ✅ CORRECCIÓN: Agregar logging y manejo de errores
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSoftwareDto, @Req() req: any) {
    try {
      console.log('Updating software ID:', id);
      console.log('Update DTO received:', dto);
      console.log('User ID:', req.user.userId);
      
      const result = await this.softwareService.update(id, dto, req.user.userId);
      console.log('Software updated successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Controller error updating software:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.softwareService.remove(id, req.user.userId);
  }
}
