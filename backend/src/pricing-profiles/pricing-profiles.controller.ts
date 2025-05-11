import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { PricingProfilesService } from './pricing-profiles.service';
  import { CreatePricingProfileDto } from './dto/create-pricing-profile.dto';
  import { UpdatePricingProfileDto } from './dto/update-pricing-profile.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
  
  @Controller('pricing-profiles')
  @UseGuards(JwtAuthGuard)
  export class PricingProfilesController {
    prisma: any;
    constructor(private readonly pricingProfilesService: PricingProfilesService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
      @GetUser('id') userId: number, // Ahora debería recibir el userId correcto
      @Body() dto: CreatePricingProfileDto
    ) {
      console.log('User ID recibido:', userId, typeof userId); // Debug crucial
      return this.pricingProfilesService.create(userId, dto);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProfile(@GetUser("id") userId: number, @Body() dto: CreatePricingProfileDto) {
      return this.prisma.pricingProfile.create({
        data: {
          userId,
          artTypeId: dto.artTypeId,
          standardHourlyRate: dto.standardHourlyRate,
          preferredHourlyRate: dto.preferredHourlyRate,
          projectsPerMonth: dto.projectsPerMonth ?? 10, // Valor por defecto si es null
          defaultCommercialLicensePercentage: dto.defaultCommercialLicensePercentage ?? 30,
          defaultUrgencyPercentage: dto.defaultUrgencyPercentage ?? 20,
        }
      });
    }
  
    @Get()
    findAll(@GetUser('id') userId: number) {
      return this.pricingProfilesService.findAllByUser(userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findByUser(@GetUser("id") userId: number) {
      return this.prisma.pricingProfile.findMany({
        where: { userId },
        include: { artType: true }
      });
    }
  
    @Get(':id')
    findOne(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.pricingProfilesService.findOne(userId, id);
    }

    @Get('debug/user')
    @UseGuards(JwtAuthGuard)
    debugUser(@GetUser() user: any) {
      return {
        user,
        tokenValidity: !!user,
        userIdType: typeof user?.id
      };
    }
  
    @Patch(':id')
    update(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePricingProfileDto: UpdatePricingProfileDto,
    ) {
      return this.pricingProfilesService.update(userId, id, updatePricingProfileDto);
    }
  
    @Delete(':id')
    remove(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.pricingProfilesService.remove(userId, id);
    }
  }