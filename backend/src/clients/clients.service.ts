import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, clientId: number) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId }
    });

    if (!client) {
      throw new NotFoundException(`Client not found or doesn't belong to user`);
    }

    return client;
  }

  async update(userId: number, clientId: number, updateClientDto: UpdateClientDto) {
    await this.findOne(userId, clientId); // Verifica pertenencia
    
    return this.prisma.client.update({
      where: { id: clientId },
      data: updateClientDto
    });
  }

  async remove(userId: number, clientId: number) {
    await this.findOne(userId, clientId); // Verifica pertenencia
    
    return this.prisma.client.delete({
      where: { id: clientId }
    });
  }
}