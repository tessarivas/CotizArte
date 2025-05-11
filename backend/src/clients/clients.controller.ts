// src/clients/clients.service.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    ParseIntPipe,
    UseGuards
  } from '@nestjs/common';
  import { ClientsService } from './clients.service';
  import { CreateClientDto } from './dto/create-client.dto';
  import { UpdateClientDto } from './dto/update-client.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { GetUser } from '../common/decorators/get-user.decorator';
  
  @Controller('clients')
  @UseGuards(JwtAuthGuard)
  export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}
  
    @Post()
    create(@GetUser('id') userId: number, @Body() createClientDto: CreateClientDto) {
      return this.clientsService.create(userId, createClientDto);
    }

    @Get()
    findAll(@GetUser('id') userId: number) {
      return this.clientsService.findAllByUser(userId);
    }
  
    @Get(':id')
    findOne(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) clientId: number
    ) {
      return this.clientsService.findOne(userId, clientId);
    }
  
    @Patch(':id')
    update(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) clientId: number,
      @Body() updateClientDto: UpdateClientDto
    ) {
      return this.clientsService.update(userId, clientId, updateClientDto);
    }
  
    @Delete(':id')
    remove(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) clientId: number
    ) {
      return this.clientsService.remove(userId, clientId);
    }
  }