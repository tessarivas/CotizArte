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

@Controller('pricing-profiles')
@UseGuards(JwtAuthGuard)
export class PricingProfilesController {
  constructor(private readonly pricingProfilesService: PricingProfilesService) {}

  @Post()
  async create(
    @GetUser('id') userId: number,
    @Body() dto: CreatePricingProfileDto
  ) {
    console.log('User ID recibido:', userId, typeof userId);
    return this.pricingProfilesService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.pricingProfilesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pricingProfilesService.findOne(userId, id);
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
