// src/quotes/quotes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

const ART_TYPE = {
  DIGITAL_ILLUSTRATION: 1,
  VIDEO_EDITING: 2,
  PAINTING: 3,
  DRAWING: 4
};

const DEFAULT_SOFTWARE_COST = 50;
const DEFAULT_MATERIAL_COST = 30;
const DEFAULT_TOOL_COST = 20;

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuoteDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        user: {
          include: {
            pricingProfiles: {
              where: { artTypeId: dto.artTypeId }
            }
          }
        },
        artType: true,
        artTechnique: true,
        client: true
      }
    });

    if (!project) throw new NotFoundException('El proyecto no existe');
    if (project.userId !== userId) throw new NotFoundException('El proyecto no pertenece a este usuario');

    if (!project.user.pricingProfiles || project.user.pricingProfiles.length === 0) {
      throw new NotFoundException("No se encontró un perfil de precios para este tipo de arte");
    }

    const costBreakdown = await this.calculateProjectCost(project, dto);

    // IMPORTANTE: El subtotal solo debe incluir basePrice + commercialFee + urgencyFee
    // Para asegurar que coincida con el cálculo del frontend
    const subtotal =
      costBreakdown.basePrice +
      costBreakdown.commercialFee +
      costBreakdown.urgencyFee;
    
    const discountAmount = subtotal * ((dto.discountPercentage || 0) / 100);
    const finalPriceAfterDiscount = subtotal - discountAmount;

    // Debug log para verificar cálculos
    console.log('Backend cost breakdown:', {
      basePrice: costBreakdown.basePrice,
      commercialFee: costBreakdown.commercialFee,
      urgencyFee: costBreakdown.urgencyFee,
      subtotal: subtotal,
      discountPercentage: dto.discountPercentage || 0,
      discountAmount: discountAmount,
      finalPriceAfterDiscount: finalPriceAfterDiscount
    });

    return this.prisma.quote.create({
      data: {
        projectId: project.id,
        clientId: dto.clientId ?? undefined,
        basePrice: costBreakdown.basePrice,
        commercialLicenseFee: costBreakdown.commercialFee,
        urgencyFee: costBreakdown.urgencyFee,
        materialsCost: costBreakdown.materialsCost,
        toolsCost: costBreakdown.toolsCost,
        finalPrice: subtotal,
        discountPercentage: dto.discountPercentage || 0,
        finalPriceAfterDiscount,
        status: 'PENDING',
        notes: dto.notes,
        shareableLink: this.generateShareableLink()
      },
      include: {
        client: true,
        project: {
          include: {
            artType: true,
            client: true
          }
        }
      }
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.quote.findMany({
      where: { project: { userId } },
      include: {
        client: true,
        project: {
          include: {
            artType: true,
            client: true
          }
        }
      }
    });
  }

  private async calculateProjectCost(project: any, dto: any) {
    const pricingProfile = project.user.pricingProfiles[0];
    const basePrice = this.calculateBasePrice(project, pricingProfile, dto);

    // Usa los porcentajes personalizados si existen, si no, usa los del perfil
    const commercialPercentage = dto.commercialPercentage !== undefined
      ? Number(dto.commercialPercentage)
      : pricingProfile.defaultCommercialLicensePercentage;

    const urgencyPercentage = dto.rapidDeliveryPercentage !== undefined
      ? Number(dto.rapidDeliveryPercentage)
      : pricingProfile.defaultUrgencyPercentage;

    const commercialFee = dto.isCommercial
      ? basePrice * (commercialPercentage / 100)
      : 0;

    const urgencyFee = dto.rapidDelivery
      ? basePrice * (urgencyPercentage / 100)
      : 0;

    const isDigital = project.artType.id === ART_TYPE.DIGITAL_ILLUSTRATION || 
                  project.artType.id === ART_TYPE.VIDEO_EDITING;
    const isTraditional = project.artType.id === ART_TYPE.PAINTING || 
                          project.artType.id === ART_TYPE.DRAWING;

    // Estos costos NO se incluyen en el subtotal, solo se almacenan
    let materialsCost = 0;
    let toolsCost = 0;
    
    if (isTraditional) {
      materialsCost = DEFAULT_MATERIAL_COST;
      toolsCost = DEFAULT_TOOL_COST;
    } else if (isDigital) {
      // Para arte digital también registramos costos pero son más bajos
      toolsCost = DEFAULT_TOOL_COST * 0.5; // Ejemplo de cómo podrías ajustar
    }

    return {
      basePrice,
      commercialFee,
      urgencyFee,
      materialsCost,
      toolsCost
    };
  }

  private calculateBasePrice(project: any, pricingProfile: any, dto: any): number {
    let basePrice = 0;
    const modificationExtra = dto.customModificationExtra !== undefined
      ? Number(dto.customModificationExtra)
      : pricingProfile.modificationExtra || 10;

    switch (project.artType.id) {
      case ART_TYPE.DIGITAL_ILLUSTRATION: {
        // Usa los insumos seleccionados, no los defaults
        const softwareCost = dto.softwareCost || 0;
        const digitalToolsCost = dto.digitalToolsCost || 0;
        const projectsPerMonth = pricingProfile.projectsPerMonth || 1;

        let baseSinDetalle = dto.hoursWorked * pricingProfile.standardHourlyRate +
          (softwareCost + digitalToolsCost) / projectsPerMonth;
        let incrementoDetalle = baseSinDetalle * (dto.detailLevel * 0.05);
        basePrice = baseSinDetalle + incrementoDetalle +
          (dto.additionalModifications * modificationExtra);
        break;
      }
      
      case ART_TYPE.VIDEO_EDITING:
        basePrice = dto.duration * pricingProfile.complexityFactor * pricingProfile.baseRatePerMinute;
        basePrice += dto.hoursWorked * pricingProfile.standardHourlyRate;
        basePrice += DEFAULT_SOFTWARE_COST / pricingProfile.projectsPerMonth;
        basePrice += pricingProfile.assetCost || 0;
        basePrice += dto.additionalModifications * modificationExtra;
        break;

      case ART_TYPE.PAINTING:
      case ART_TYPE.DRAWING:
        basePrice = parseFloat(dto.size || 0) * pricingProfile.techniqueFactor;
        basePrice += dto.hoursWorked * pricingProfile.standardHourlyRate;
        // Importante: incluir estos cargos en el precio base para arte tradicional
        basePrice += pricingProfile.shippingFee || 20;
        basePrice += pricingProfile.certificateFee || 30;
        basePrice += dto.additionalModifications * modificationExtra;
        break;
    }

    return basePrice;
  }

  private generateShareableLink(): string {
    return `https://cotizarte.com/quote/${Math.random().toString(36).substring(2, 15)}`;
  }
}