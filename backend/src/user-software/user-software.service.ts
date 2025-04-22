import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserSoftwareDto } from './dto/create-user-software.dto';
import { UpdateUserSoftwareDto } from './dto/update-user-software.dto';

@Injectable()
export class UserSoftwareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateUserSoftwareDto) {
    // Validación para software predefinido
    if (!dto.isCustom && dto.softwareId) {
      const softwareExists = await this.prisma.software.findUnique({
        where: { id: dto.softwareId }
      });
      if (!softwareExists) throw new NotFoundException('Software no encontrado');
    }
  
    return this.prisma.userSoftware.create({
      data: {
        userId,
        softwareId: dto.isCustom ? null : dto.softwareId,
        customName: dto.isCustom ? dto.customName : null,
        isCustom: dto.isCustom,
        licenseType: dto.licenseType,
        actualCost: dto.actualCost
      }
    });
  }

  async findAllByUser(userId: number) { // userId como number
    return this.prisma.userSoftware.findMany({
      where: { userId },
      include: { software: true },
    });
  }

  async update(id: number, updateUserSoftwareDto: UpdateUserSoftwareDto) { // id como number
    return this.prisma.userSoftware.update({
      where: { id },
      data: updateUserSoftwareDto,
    });
  }

  async remove(id: number) { // id como number
    return this.prisma.userSoftware.delete({
      where: { id },
    });
  }
}