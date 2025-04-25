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
  
    return this.prisma.pricingProfile.create({
      data: {
        standardHourlyRate: dto.standardHourlyRate,
        preferredHourlyRate: dto.preferredHourlyRate,
        projectsPerMonth: dto.projectsPerMonth,
        user: { connect: { id: userId } }, // Conexión segura
        artType: { connect: { id: dto.artTypeId } }
      },
      include: { user: true, artType: true } // Para debug
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.pricingProfile.findMany({
      where: { userId },
      include: { artType: true }, // Incluye datos del tipo de arte
    });
  }

  async findOne(userId: number, id: number) {
    const profile = await this.prisma.pricingProfile.findFirst({
      where: { id, userId },
      include: { artType: true },
    });

    if (!profile) {
      throw new NotFoundException('Perfil de precios no encontrado');
    }

    return profile;
  }

  async update(userId: number, id: number, updatePricingProfileDto: UpdatePricingProfileDto) {
    await this.findOne(userId, id); // Verifica que el perfil exista y pertenezca al usuario

    return this.prisma.pricingProfile.update({
      where: { id },
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