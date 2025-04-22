import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ArtTypesService } from './art-types.service';
  import { CreateArtTypeDto } from './dto/create-art-type.dto';
  import { UpdateArtTypeDto } from './dto/update-art-type.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  
  @Controller('art-types')
  export class ArtTypesController {
    constructor(private readonly artTypesService: ArtTypesService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createArtTypeDto: CreateArtTypeDto) {
      return this.artTypesService.create(createArtTypeDto);
    }
  
    @Get()
    findAll() {
      return this.artTypesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.artTypesService.findOne(+id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateArtTypeDto: UpdateArtTypeDto) {
      return this.artTypesService.update(+id, updateArtTypeDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
      return this.artTypesService.remove(+id);
    }
  
    // Endpoint adicional para filtrar por categoría
    @Get('by-category/:categoryId')
    findByCategory(@Param('categoryId') categoryId: string) {
      return this.artTypesService.findByCategory(+categoryId);
    }
  }