import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';

@Injectable()
export class SoftwareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSoftwareDto: CreateSoftwareDto) {
    return this.prisma.software.create({
      data: createSoftwareDto,
    });
  }

  async findAll() {
    return this.prisma.software.findMany();
  }

  async findOne(id: string) {
    return this.prisma.software.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async update(id: string, updateSoftwareDto: UpdateSoftwareDto) {
    return this.prisma.software.update({
      where: { id: parseInt(id) },
      data: updateSoftwareDto,
    });
  }

  async remove(id: string) {
    return this.prisma.software.delete({
      where: { id: parseInt(id) },
    });
  }
}