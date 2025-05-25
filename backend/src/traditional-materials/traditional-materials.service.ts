import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTraditionalMaterialDto } from './dto/create-traditional-material.dto';
import { UpdateTraditionalMaterialDto } from './dto/update-traditional-material.dto';

@Injectable()
export class TraditionalMaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTraditionalMaterialDto, userId: number) {
    return this.prisma.traditionalMaterial.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  async findAll(userId: number) {
    return this.prisma.traditionalMaterial.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const material = await this.prisma.traditionalMaterial.findFirst({ where: { id, userId } });
    if (!material) throw new NotFoundException('Traditional Material not found');
    return material;
  }

  async update(id: number, dto: UpdateTraditionalMaterialDto, userId: number) {
    // Verifica propiedad antes de actualizar
    const material = await this.prisma.traditionalMaterial.findFirst({ where: { id, userId } });
    if (!material) throw new NotFoundException('Traditional Material not found');
    return this.prisma.traditionalMaterial.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    // Verifica propiedad antes de borrar
    const material = await this.prisma.traditionalMaterial.findFirst({ where: { id, userId } });
    if (!material) throw new NotFoundException('Traditional Material not found');
    return this.prisma.traditionalMaterial.delete({ where: { id } });
  }
}
