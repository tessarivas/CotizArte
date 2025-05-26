// backend/src/projects/projects.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectCompleteDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from "@prisma/client";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        artType: true,
        artTechnique: true,
        client: true,
        digitalIllustration: true,
        videoEditing: true,
        painting: true,
        drawing: true,
      },
    });
  }

  async findByArtType(userId: number, artTypeId: number) {
    return this.prisma.project.findMany({
      where: { userId, artTypeId },
      include: {
        artType: true,
        client: true,
      },
    });
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        artType: true,
        artTechnique: true,
        client: true,
        digitalIllustration: true,
        videoEditing: true,
        painting: true,
        drawing: true,
      }
    });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado.');
    }
    return project;
  }

  async create(userId: number, dto: CreateProjectCompleteDto) {
    // Validación de relaciones: artType, técnica y cliente
    await this.validateRelations(userId, dto);
    try {
      const project = await this.prisma.$transaction(async (tx) => {
        // Extraer las propiedades de especialización del DTO
        const { 
          digitalIllustration,
          videoEditing,
          painting,
          drawing,
          ...projectData 
        } = dto;
        
        // Crear el registro principal en Project
        const createdProject = await tx.project.create({
          data: {
            ...projectData,
            userId,
          },
          include: {
            artType: true,
            artTechnique: true,
            client: true,
          },
        });

        // Crear el registro especializado según el artTypeId
        if (digitalIllustration && dto.artTypeId === 1) {
          await tx.digitalIllustration.create({
            data: {
              projectId: createdProject.id,
              ...digitalIllustration,
            },
          });
        }
        if (videoEditing && dto.artTypeId === 2) {
          await tx.videoEditing.create({
            data: {
              projectId: createdProject.id,
              ...videoEditing,
            },
          });
        }
        if (painting && dto.artTypeId === 3) {
          await tx.painting.create({
            data: {
              projectId: createdProject.id,
              ...painting,
            },
          });
        }
        if (drawing && dto.artTypeId === 4) {
          await tx.drawing.create({
            data: {
              projectId: createdProject.id,
              ...drawing,
            },
          });
        }

        return createdProject;
      });
      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException("Error en los datos proporcionados");
      }
      throw error;
    }
  }

  async update(userId: number, id: number, dto: UpdateProjectDto) {
    try {
      // Log the incoming data
      console.log('Update DTO:', dto);

      // Verify project exists and belongs to user
      const project = await this.prisma.project.findFirst({
        where: { id, userId },
      });

      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');
      }

      // Validate numeric fields
      if (dto.detailLevel && (isNaN(Number(dto.detailLevel)) || Number(dto.detailLevel) < 1 || Number(dto.detailLevel) > 5)) {
        throw new BadRequestException('Nivel de detalle debe ser un número entre 1 y 5');
      }

      if (dto.hoursWorked && (isNaN(Number(dto.hoursWorked)) || Number(dto.hoursWorked) < 0)) {
        throw new BadRequestException('Horas trabajadas debe ser un número positivo');
      }

      // Clean up undefined values
      const cleanDto = Object.fromEntries(
        Object.entries(dto).filter(([_, v]) => v !== undefined)
      );

      // Validate relationships if being updated
      if (cleanDto.artTypeId || cleanDto.artTechniqueId || cleanDto.clientId) {
        await this.validateRelations(userId, cleanDto as CreateProjectCompleteDto);
      }

      // Update project
      const updated = await this.prisma.project.update({
        where: { id },
        data: {
          ...cleanDto,
          detailLevel: cleanDto.detailLevel ? Number(cleanDto.detailLevel) : undefined,
          hoursWorked: cleanDto.hoursWorked ? Number(cleanDto.hoursWorked) : undefined,
        },
        include: {
          artType: true,
          artTechnique: true,
          client: true,
          digitalIllustration: true,
          videoEditing: true,
          painting: true,
          drawing: true,
        },
      });

      return updated;
    } catch (error) {
      console.error('Update error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`Error al actualizar el proyecto: ${error.message}`);
      }
      throw error;
    }
  }

  private async validateRelations(userId: number, dto: CreateProjectCompleteDto) {
    const [artType, technique, client] = await Promise.all([
      this.prisma.artType.findUnique({ where: { id: dto.artTypeId } }),
      dto.artTechniqueId
        ? this.prisma.artTechnique.findFirst({
            where: { id: dto.artTechniqueId, artTypeId: dto.artTypeId },
          })
        : Promise.resolve(null),
      dto.clientId
        ? this.prisma.client.findFirst({ where: { id: dto.clientId, userId } })
        : Promise.resolve(null),
    ]);

    if (!artType) throw new NotFoundException("Tipo de arte no encontrado");
    if (dto.artTechniqueId && !technique)
      throw new NotFoundException("Técnica no válida para este tipo de arte");
    if (dto.clientId && !client)
      throw new NotFoundException("Cliente no encontrado");
  }
}