// src/art-categories/art-categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtCategoryDto } from './dto/create-art-category.dto';
import { UpdateArtCategoryDto } from './dto/update-art-category.dto';

@Injectable()
export class ArtCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtCategoryDto: CreateArtCategoryDto) {
    return await this.prisma.artCategory.create({
      data: createArtCategoryDto,
    });
  }

  async findAll() {
    return await this.prisma.artCategory.findMany({
      include: {
        artTypes: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.artCategory.findUnique({
      where: { id: Number(id) },
      include: {
        artTypes: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: string, updateArtCategoryDto: UpdateArtCategoryDto) {
    try {
      return await this.prisma.artCategory.update({
        where: { id: Number(id) },
        data: updateArtCategoryDto,
      });
    } catch (error) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.artCategory.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }
}