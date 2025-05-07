// backend/src/projects/projects.module.ts
import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService], // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class ProjectsModule {}
