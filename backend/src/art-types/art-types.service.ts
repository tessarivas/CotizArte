import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtTypeDto } from './dto/create-art-type.dto';
import { UpdateArtTypeDto } from './dto/update-art-type.dto';

@Injectable()
export class ArtTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtTypeDto: CreateArtTypeDto) {
    // Verificar si la categoría existe
    const categoryExists = await this.prisma.artCategory.findUnique({
      where: { id: createArtTypeDto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Categoría con ID ${createArtTypeDto.categoryId} no encontrada`);
    }

    return this.prisma.artType.create({
      data: createArtTypeDto,
    });
  }

  async findAll() {
    return this.prisma.artType.findMany({
      include: {
        category: true,
        techniques: true,
      },
    });
  }

  async findOne(id: number) {
    const artType = await this.prisma.artType.findUnique({
      where: { id },
      include: {
        category: true,
        techniques: true,
      },
    });

    if (!artType) {
      throw new NotFoundException(`Tipo de arte con ID ${id} no encontrado`);
    }

    return artType;
  }

  async update(id: number, updateArtTypeDto: UpdateArtTypeDto) {
    try {
      return await this.prisma.artType.update({
        where: { id },
        data: updateArtTypeDto,
      });
    } catch (error) {
      throw new NotFoundException(`Tipo de arte con ID ${id} no encontrado`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.artType.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Tipo de arte con ID ${id} no encontrado`);
    }
  }

  // Método adicional para buscar tipos por categoría
  async findByCategory(categoryId: number) {
    return this.prisma.artType.findMany({
      where: { categoryId },
      include: { techniques: true },
    });
  }
}