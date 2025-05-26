import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtTechniqueDto } from './dto/create-art-technique.dto';
import { UpdateArtTechniqueDto } from './dto/update-art-technique.dto';

@Injectable()
export class ArtTechniquesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtTechniqueDto: CreateArtTechniqueDto) {
    // Validar que el ArtType exista
    const artTypeExists = await this.prisma.artType.findUnique({
      where: { id: createArtTechniqueDto.artTypeId },
    });

    if (!artTypeExists) {
      throw new NotFoundException(
        `Tipo de arte con ID ${createArtTechniqueDto.artTypeId} no encontrado`,
      );
    }

    return this.prisma.artTechnique.create({
      data: createArtTechniqueDto,
    });
  }

  async findAll() {
    return this.prisma.artTechnique.findMany({
      include: {
        artType: {
          include: {
            category: true, // Incluye la categoría padre
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.artTechnique.findUnique({
      where: { id },
      include: {
        artType: true,
      },
    });
  }
  
  async update(id: number, updateArtTechniqueDto: UpdateArtTechniqueDto) {
    try {
      return await this.prisma.artTechnique.update({
        where: { id },
        data: updateArtTechniqueDto,
      });
    } catch (error) {
      throw new NotFoundException(`Técnica con ID ${id} no encontrada`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.artTechnique.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Técnica con ID ${id} no encontrada`);
    }
  }

  // Método adicional: Buscar técnicas por tipo de arte
  // En art-techniques.service.ts
  async findByArtType(artTypeId: number) {
    return this.prisma.artTechnique.findMany({
        where: { artTypeId },
        select: {
            id: true,
            name: true,
            description: true,
            priceMultiplier: true, // Asegúrate de que esté incluido
            artType: true,
        },
    });
  }
}