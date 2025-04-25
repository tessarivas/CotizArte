import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommercialLicenseDto } from './dto/create-commercial-license.dto';
import { UpdateCommercialLicenseDto } from './dto/update-commercial-license.dto';

@Injectable()
export class CommercialLicenseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommercialLicenseDto) {
    return this.prisma.commercialLicense.create({
      data: {
        name: dto.name,
        description: dto.description,
        percentageIncrease: dto.percentageIncrease,
      },
    });
  }

  async findAll() {
    return this.prisma.commercialLicense.findMany();
  }

  async findOne(id: number) {
    const license = await this.prisma.commercialLicense.findUnique({ where: { id } });
    if (!license) {
      throw new NotFoundException('Licencia comercial no encontrada');
    }
    return license;
  }

  async update(id: number, dto: UpdateCommercialLicenseDto) {
    const license = await this.prisma.commercialLicense.findUnique({ where: { id } });
    if (!license) {
      throw new NotFoundException('Licencia comercial no encontrada');
    }
    return this.prisma.commercialLicense.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: number) {
    const license = await this.prisma.commercialLicense.findUnique({ where: { id } });
    if (!license) {
      throw new NotFoundException('Licencia comercial no encontrada');
    }
    return this.prisma.commercialLicense.delete({ where: { id } });
  }
}
