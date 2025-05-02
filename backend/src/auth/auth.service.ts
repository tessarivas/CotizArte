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
  
    // 2. Verificar contraseña
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
  
    // 3. Generar token JWT
    const payload = { email: user.email, sub: user.id };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email, // ✅ Ahora incluye el email
        bio: user.bio, // ✅ Ahora incluye la bio
        profileImageUrl: user.profileImageUrl, // ✅ Ahora incluye la imagen de perfil
      },
    };
  }

  async register(registerDto: RegisterDto, file?: Express.Multer.File) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });
  
      if (existingUser) {
        throw new UnauthorizedException("Este correo ya está registrado.");
      }
  
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const imageUrl = file ? `/uploads/${file.filename}` : null; // ✅ Guarda imagen si existe
  
      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          bio: registerDto.bio,
          profileImageUrl: imageUrl, // ✅ Ahora guarda la imagen correctamente
        },
      });
  
      return { message: "Usuario registrado exitosamente", data: user };
    } catch (error) {
      console.error("Error en register:", error);
      throw new InternalServerErrorException("Error al registrar usuario");
    }
  }  
}
