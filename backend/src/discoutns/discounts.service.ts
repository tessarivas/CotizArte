import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDiscountDto) {
    return this.prisma.discount.create({
      data: {
        name: dto.name,
        description: dto.description,
        percentage: dto.percentage,
        isActive: dto.isActive ?? true,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        user: { connect: { id: dto.userId } }, // Conexión con el modelo User
      },
    });
  }
  

  async findAll() {
    return this.prisma.discount.findMany();
  }

  async findOne(id: number) {
    const discount = await this.prisma.discount.findUnique({ where: { id } });
    if (!discount) {
      throw new NotFoundException('Descuento no encontrado');
    }
    return discount;
  }

  async update(id: number, dto: UpdateDiscountDto) {
    const discount = await this.prisma.discount.findUnique({ where: { id } });
    if (!discount) {
      throw new NotFoundException('Descuento no encontrado');
    }
    return this.prisma.discount.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: number) {
    const discount = await this.prisma.discount.findUnique({ where: { id } });
    if (!discount) {
      throw new NotFoundException('Descuento no encontrado');
    }
    return this.prisma.discount.delete({ where: { id } });
  }
}
