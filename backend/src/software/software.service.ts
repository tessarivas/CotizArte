import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';

@Injectable()
export class SoftwareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSoftwareDto, userId: number) {
    if (!userId) throw new Error('userId is required');
    const payload = {
      ...dto,
      userId,
      monthlyCost: dto.monthlyCost ?? 0,
      annualCost: dto.annualCost ?? 0,
    };
    return this.prisma.software.create({ data: payload });
  }

  async findAll(userId: number) {
    return this.prisma.software.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const software = await this.prisma.software.findFirst({ where: { id, userId } });
    if (!software) {
      throw new NotFoundException('Software not found');
    }
    return software;
  }

  async update(id: number, dto: UpdateSoftwareDto, userId: number) {
    // Verifica que el software pertenezca al usuario
    const software = await this.prisma.software.findFirst({ where: { id, userId } });
    if (!software) {
      throw new NotFoundException('Software not found');
    }
    return this.prisma.software.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    // Verifica que el software pertenezca al usuario
    const software = await this.prisma.software.findFirst({ where: { id, userId } });
    if (!software) {
      throw new NotFoundException('Software not found');
  }
    return this.prisma.software.delete({ where: { id } });
  }
}