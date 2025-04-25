import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true }, // No exponer contraseñas
    });
  }

  async findOne(id: number) {
    if (!id) {
      throw new Error('Se requiere un ID de usuario');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { clients: true, projects: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    let hashedPassword = user.password;

    if (updateUserDto.password) {
      if (!updateUserDto.oldPassword) {
        throw new Error('Se requiere la contraseña actual');
      }
      const isValid = await bcrypt.compare(updateUserDto.oldPassword, user.password);
      if (!isValid) throw new Error('Contraseña actual incorrecta');

      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id); // Asegurarse de que el usuario existe
    return this.prisma.user.delete({ where: { id } });
  }
}
