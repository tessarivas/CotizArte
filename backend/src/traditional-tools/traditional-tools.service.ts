import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTraditionalToolDto } from './dto/create-traditional-tool.dto'
import { UpdateTraditionalToolDto } from './dto/update-traditional-tool.dto'

@Injectable()
export class TraditionalToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTraditionalToolDto, userId: number) {
    return this.prisma.traditionalTool.create({ data: { ...dto, userId } });
  }

  async findAll(userId: number) {
    return this.prisma.traditionalTool.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const tool = await this.prisma.traditionalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Traditional Tool not found');
    return tool;
  }

  async update(id: number, dto: UpdateTraditionalToolDto, userId: number) {
    const tool = await this.prisma.traditionalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Traditional Tool not found');
    return this.prisma.traditionalTool.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const tool = await this.prisma.traditionalTool.findFirst({ where: { id, userId } });
    if (!tool) throw new NotFoundException('Traditional Tool not found');
    return this.prisma.traditionalTool.delete({ where: { id } });
  }
}
