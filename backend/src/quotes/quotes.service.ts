// quotes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuoteDto) {
    // 1. Validar proyecto y pertenencia al usuario
    const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
        include: {
          user: {
            include: {
              pricingProfiles: {
                where: {
                  artTypeId: dto.artTypeId
                }
              }
            }
          },
          artType: true,
          artTechnique: true,
          client: true
        }
      });

      if (!project) {
        throw new NotFoundException('El proyecto no existe');
      }
      if (project.userId !== userId) {
        throw new NotFoundException('El proyecto no pertenece a este usuario');
      }
      

    // 2. Calcular costos (implementaremos esta función después)
    const costBreakdown = await this.calculateProjectCost(project);

    // 3. Crear la cotización
    return this.prisma.quote.create({
      data: {
        projectId: project.id,
        basePrice: costBreakdown.basePrice,
        commercialLicenseFee: costBreakdown.commercialFee,
        urgencyFee: costBreakdown.urgencyFee,
        materialsCost: costBreakdown.materialsCost,
        toolsCost: costBreakdown.toolsCost,
        finalPrice: costBreakdown.finalPrice,
        discountPercentage: dto.discountPercentage || 0,
        finalPriceAfterDiscount: costBreakdown.finalPrice * (1 - (dto.discountPercentage || 0) / 100),
        status: 'PENDING',
        notes: dto.notes,
        shareableLink: this.generateShareableLink() // Implementar esta función
      },
      include: {
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
        project: {
          include: {
            artType: true,
            client: true
          }
        }
      }
    });
  }

  private async calculateProjectCost(project: any) {
    if (!project.user.pricingProfiles || project.user.pricingProfiles.length === 0) {
        throw new NotFoundException('No se encontró un perfil de precios para este tipo de arte');
    }

    const pricingProfile = project.user.pricingProfiles[0];
    if (!pricingProfile) {
      throw new NotFoundException('El usuario no tiene un perfil de precios configurado');
    }
    
    // 1. Obtener costos de materiales y herramientas
    const [materialsCost, toolsCost] = await Promise.all([
      this.getMaterialsCost(project.id),
      this.getToolsCost(project.id)
    ]);
  
    // 2. Calcular precio base según tipo de arte
    let basePrice = project.hoursWorked * pricingProfile.standardHourlyRate;  
    
    // 3. Aplicar multiplicador de técnica si existe
    if (project.artTechnique) {
      basePrice *= project.artTechnique.priceMultiplier;
    }
  
    // 4. Calcular extras
    const commercialFee = project.isCommercial
      ? basePrice * (pricingProfile.defaultCommercialLicensePercentage / 100)
      : 0;
    const urgencyFee = project.rapidDelivery
      ? basePrice * (pricingProfile.defaultUrgencyPercentage / 100)
      : 0;
  
    // 5. Total
    const subtotal = basePrice + commercialFee + urgencyFee + materialsCost + toolsCost;
  
    return {
      basePrice,
      commercialFee,
      urgencyFee,
      materialsCost,
      toolsCost,
      finalPrice: subtotal
    };
  }
  
  private async getMaterialsCost(projectId: number): Promise<number> {
    const materials = await this.prisma.projectTraditionalMaterial.findMany({
      where: { projectId },
      include: { material: true }
    });
  
    return materials.reduce((sum, pm) => sum + (pm.material.averageCost * pm.quantity), 0);
  }
  
  private async getToolsCost(projectId: number): Promise<number> {
    const tools = await this.prisma.projectDigitalTool.findMany({
      where: { projectId },
      include: { digitalTool: true }
    });
  
    // Costo amortizado (costo total / vida útil en proyectos)
    return tools.reduce((sum, pt) => sum + (pt.digitalTool.averageCost / pt.digitalTool.averageLifespan), 0);
  }

  private generateShareableLink(): string {
    return `https://cotizarte.com/quote/${Math.random().toString(36).substring(2, 15)}`;
  }
}