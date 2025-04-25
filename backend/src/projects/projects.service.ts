import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        artType: true,
        client: true,
        artTechnique: true
      }
    });
  }

  async findByArtType(userId: number, artTypeId: number) {
    return this.prisma.project.findMany({
      where: { 
        userId,
        artTypeId 
      },
      include: {
        artType: true,
        client: true
      }
    });
  }

  async create(userId: number, dto: CreateProjectDto) {
    await this.validateRelations(userId, dto);

    return this.prisma.project.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        artType: true,
        artTechnique: true,
        client: true
      }
    });
  }

  private async validateRelations(userId: number, dto: CreateProjectDto) {
    const [artType, technique, client] = await Promise.all([
      this.prisma.artType.findUnique({ where: { id: dto.artTypeId } }),
      dto.artTechniqueId 
        ? this.prisma.artTechnique.findFirst({
            where: { 
              id: dto.artTechniqueId,
              artTypeId: dto.artTypeId // Validación añadida
            }
          })
        : Promise.resolve(null),
      dto.clientId 
        ? this.prisma.client.findFirst({ where: { id: dto.clientId, userId } })
        : Promise.resolve(null)
    ]);

    if (!artType) throw new NotFoundException('Tipo de arte no encontrado');
    if (dto.artTechniqueId && !technique) {
      throw new NotFoundException('Técnica no válida para este tipo de arte');
    }
    if (dto.clientId && !client) {
      throw new NotFoundException('Cliente no encontrado');
    }
  }
}