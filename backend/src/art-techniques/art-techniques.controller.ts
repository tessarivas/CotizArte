import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    Query,
  } from '@nestjs/common';
  import { ArtTechniquesService } from './art-techniques.service';
  import { CreateArtTechniqueDto } from './dto/create-art-technique.dto';
  import { UpdateArtTechniqueDto } from './dto/update-art-technique.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  
  @Controller('art-techniques')
  export class ArtTechniquesController {
    constructor(private readonly artTechniquesService: ArtTechniquesService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createArtTechniqueDto: CreateArtTechniqueDto) {
      return this.artTechniquesService.create(createArtTechniqueDto);
    }
  
    @Get()
    findAll() {
      return this.artTechniquesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.artTechniquesService.findOne(+id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
      @Param('id') id: string,
      @Body() updateArtTechniqueDto: UpdateArtTechniqueDto,
    ) {
      return this.artTechniquesService.update(+id, updateArtTechniqueDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
      return this.artTechniquesService.remove(+id);
    }
  
    // Endpoint adicional: Filtrar por tipo de arte
    @Get('by-art-type/:artTypeId')
    findByArtType(@Param('artTypeId') artTypeId: string) {
      return this.artTechniquesService.findByArtType(+artTypeId);
    }
  }