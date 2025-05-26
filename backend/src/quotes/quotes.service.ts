// src/quotes/quotes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateQuoteDto) {
    // Verificar que el proyecto existe y pertenece al usuario
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        user: true,
        artType: true,
        artTechnique: true,
        client: true
      }
    });

    if (!project) throw new NotFoundException('El proyecto no existe');
    if (project.userId !== userId) throw new NotFoundException('El proyecto no pertenece a este usuario');

    // El frontend ya calculó todo, solo guardamos los valores
    return this.prisma.quote.create({
      data: {
        projectId: project.id,
        clientId: dto.clientId ?? undefined,
        
        // Valores calculados desde el frontend
        basePrice: dto.basePrice,
        commercialLicenseFee: dto.commercialFee,
        urgencyFee: dto.urgencyFee,
        materialsCost: dto.materialsCost,
        toolsCost: dto.toolsCost,
        
        // Precio final SIN descuento (subtotal)
        finalPrice: dto.subtotal,
        
        // Descuento
        discountPercentage: dto.discountPercentage || 0,
        
        // Precio final CON descuento aplicado
        finalPriceAfterDiscount: dto.total,
        
        status: 'PENDING',
        notes: dto.notes,
        shareableLink: this.generateShareableLink() // ✅ GENERAR SOLO ID ÚNICO
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
      where: {
        project: {
          userId: userId
        }
      },
      include: {
        client: true,
        project: {
          include: {
            artType: true,
            client: true,
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number, userId: number) {
    const quote = await this.prisma.quote.findFirst({
      where: {
        id: id,
        project: {
          userId: userId
        }
      },
      include: {
        client: true,
        project: {
          include: {
            artType: true,
            artTechnique: true,
            client: true,
            user: true
          }
        }
      }
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quote;
  }

  async update(id: number, userId: number, updateData: UpdateQuoteDto) {
    console.log("Datos recibidos para actualizar:", updateData);

    try {
      // Verifica que la cotización existe y pertenece al usuario
      const existingQuote = await this.prisma.quote.findFirst({
        where: { id, project: { userId } },
      });

      if (!existingQuote) {
        throw new NotFoundException("Cotización no encontrada");
      }

      console.log("Cotización encontrada, procediendo a actualizar...");

      // Actualizar directamente con los datos recibidos
      // Ya no filtramos campos porque el DTO ya está limpio
      const updatedQuote = await this.prisma.quote.update({
        where: { id },
        data: updateData,
        include: {
          client: true,
          project: {
            include: {
              artType: true,
              client: true,
              user: true
            }
          }
        }
      });

      console.log("Cotización actualizada exitosamente");
      return updatedQuote;

    } catch (error) {
      console.error("Error en el backend al actualizar la cotización:", error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Log más detallado del error de Prisma
      if (error.code) {
        console.error("Código de error Prisma:", error.code);
        console.error("Meta del error:", error.meta);
      }
      
      throw new Error(`Error al actualizar la cotización: ${error.message}`);
    }
  }

  async delete(id: number, userId: number) {
    // Verificar que la cotización pertenece al usuario
    await this.findOne(id, userId);

    return this.prisma.quote.delete({
      where: { id }
    });
  }

  // ✅ AGREGAR ENDPOINT PARA COTIZACIONES COMPARTIDAS
  async findByShareableLink(shareableLink: string) {
    const quote = await this.prisma.quote.findFirst({
      where: {
        shareableLink: shareableLink
      },
      include: {
        client: true,
        project: {
          include: {
            artType: true,
            artTechnique: true,
            client: true,
            user: true
          }
        }
      }
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return quote;
  }

  // ✅ MÉTODO CORREGIDO PARA GENERAR SOLO ID ÚNICO
  private generateShareableLink(): string {
    // Opción 1: Usando crypto (más seguro)
    return randomBytes(16).toString('hex').substring(0, 12);
    
    // Opción 2: Alternativa sin crypto
    // return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }
}