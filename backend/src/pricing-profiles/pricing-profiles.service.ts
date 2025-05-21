// src/pricing-profiles/pricing-profiles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingProfileDto } from './dto/create-pricing-profile.dto';
import { UpdatePricingProfileDto } from './dto/update-pricing-profile.dto';

@Injectable()
export class PricingProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePricingProfileDto) {
    // Verifica que el usuario exista
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!userExists) throw new NotFoundException('Usuario no encontrado');

    // Verifica que el ArtType exista
    const artTypeExists = await this.prisma.artType.findUnique({
      where: { id: dto.artTypeId }
    });
    if (!artTypeExists) throw new NotFoundException('Tipo de arte no encontrado');

    // Asegúrate de que projectsPerMonth tenga un valor
    const projectsPerMonth = dto.projectsPerMonth ?? 0;

    return this.prisma.pricingProfile.create({
      data: {
        standardHourlyRate: dto.standardHourlyRate,
        preferredHourlyRate: dto.preferredHourlyRate,
        projectsPerMonth: projectsPerMonth,
        modificationExtra: dto.modificationExtra ?? 0,
        defaultCommercialLicensePercentage: dto.defaultCommercialLicensePercentage ?? 30, // <--
        defaultUrgencyPercentage: dto.defaultUrgencyPercentage ?? 20, // <--
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
        ...(artTypeId && { artTypeId }) // Filtrar por tipo de arte si se pasa
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
    await this.findOne(userId, id); // Verifica pertenencia

    return this.prisma.pricingProfile.delete({
      where: { id },
    });
  }
}