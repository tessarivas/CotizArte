// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Asegúrate de importar JwtModule en auth.module.ts
  ) {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

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
      
      // ✅ Subir imagen a Cloudinary si existe
      let imageUrl = null;
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'cotizarte/profiles',
          resource_type: 'image'
        });
        imageUrl = result.secure_url;
      }
  
      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          bio: registerDto.bio,
          profileImageUrl: imageUrl, // ✅ URL de Cloudinary
        },
      });
  
      return { message: "Usuario registrado exitosamente", data: user };
    } catch (error) {
      console.error("Error en register:", error);
      throw new InternalServerErrorException("Error al registrar usuario");
    }
  }  
}
