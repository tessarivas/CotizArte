// src/pricing-profiles/pricing-profiles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingProfileDto } from './dto/create-pricing-profile.dto';
import { UpdatePricingProfileDto } from './dto/update-pricing-profile.dto';

@Injectable()
export class PricingProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePricingProfileDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!userExists) throw new NotFoundException('Usuario no encontrado');

    const artTypeExists = await this.prisma.artType.findUnique({
      where: { id: dto.artTypeId }
    });
    if (!artTypeExists) throw new NotFoundException('Tipo de arte no encontrado');

    return this.prisma.pricingProfile.create({
      data: {
        standardHourlyRate: dto.standardHourlyRate,
        preferredHourlyRate: dto.preferredHourlyRate,
        projectsPerMonth: dto.projectsPerMonth,
        modificationExtra: dto.modificationExtra,
        defaultCommercialLicensePercentage: dto.defaultCommercialLicensePercentage,
        defaultUrgencyPercentage: dto.defaultUrgencyPercentage,
        user: { connect: { id: userId } },
        artType: { connect: { id: dto.artTypeId } }
      },
      include: { user: true, artType: true }
    });
  }

  async findAllByUser(userId: number, artTypeId?: number) {
    return this.prisma.pricingProfile.findMany({
      where: { 
        userId,
        ...(artTypeId && { artTypeId }) 
      },
      include: { artType: true },
    });
  }

  async findOne(userId: number, id: number) {
    const profile = await this.prisma.pricingProfile.findUnique({
      where: { id },
      include: { artType: true },
    });

    if (!profile || profile.userId !== userId) {
      throw new NotFoundException('Perfil de precios no encontrado o no pertenece a este usuario');
    }

    return profile;
  }

  async update(userId: number, id: number, updatePricingProfileDto: UpdatePricingProfileDto) {
    const profile = await this.findOne(userId, id);
    if (!profile) throw new NotFoundException('No puedes modificar este perfil');

    return this.prisma.pricingProfile.update({
      where: { id, userId },
      data: updatePricingProfileDto,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id); 

    return this.prisma.pricingProfile.delete({
      where: { id },
    });
  }
}