// backend/src/projects/projects.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CreateProjectCompleteDto } from "./dto/create-project.dto";
import { GetUser } from "src/common/decorators/get-user.decorator";
import { ProjectsService } from "./projects.service";
import { Prisma } from "@prisma/client";

@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  async create(
    @GetUser("id") userId: number,
    @Body() dto: CreateProjectCompleteDto
  ) {
    try {
      return await this.service.create(userId, dto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException("Error en los datos proporcionados");
      }
      throw error;
    }
  }

  @Get()
  findAll(@GetUser("id") userId: number) {
    return this.service.findAllByUser(userId);
  }

  @Get("by-art-type/:artTypeId")
  findByArtType(
    @GetUser("id") userId: number,
    @Param("artTypeId", ParseIntPipe) artTypeId: number
  ) {
    return this.service.findByArtType(userId, artTypeId);
  }
}