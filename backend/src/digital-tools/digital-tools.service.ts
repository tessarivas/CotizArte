import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalToolDto } from './dto/create-digital-tool.dto';
import { UpdateDigitalToolDto } from './dto/update-digital-tool.dto';

@Injectable()
export class DigitalToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDigitalToolDto, userId: number) {
    return this.prisma.digitalTool.create({ data: { ...dto, userId } });
  }

  async findAll(userId: number) {
    return this.prisma.digitalTool.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const tool = await this.prisma.digitalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Digital Tool not found');
    return tool;
  }

  async update(id: number, dto: UpdateDigitalToolDto, userId: number) {
    const tool = await this.prisma.digitalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Digital Tool not found');
    return this.prisma.digitalTool.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const tool = await this.prisma.digitalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Digital Tool not found');
    return this.prisma.digitalTool.delete({ where: { id } });
  }
}
