// src/art-categories/art-categories.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArtCategoriesService } from './art-categories.service';
import { CreateArtCategoryDto } from './dto/create-art-category.dto';
import { UpdateArtCategoryDto } from './dto/update-art-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'; // Asegúrate de que la ruta es correcta

@Controller('art-categories')
export class ArtCategoriesController {
  constructor(private readonly artCategoriesService: ArtCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createArtCategoryDto: CreateArtCategoryDto) {
    return this.artCategoriesService.create(createArtCategoryDto);
  }

  @Get()
  findAll() {
    return this.artCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artCategoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateArtCategoryDto: UpdateArtCategoryDto,
  ) {
    return this.artCategoriesService.update(id, updateArtCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.artCategoriesService.remove(id);
  }
}