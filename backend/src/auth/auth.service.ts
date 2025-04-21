// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Asegúrate de importar JwtModule en auth.module.ts
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Buscar usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // 2. Verificar contraseña (si existe el usuario)
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar token JWT
    const payload = { email: user.email, sub: user.id }; // 👈 Usa el id de la BD
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: user.email, id: user.id }, // 👈 Opcional: devolver info del usuario
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
        },
      });
      return { message: 'User registered successfully', data: user };
    } catch (error) {
      console.error('Error en register:', error); // 👈 Debug clave
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }
}
