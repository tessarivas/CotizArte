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
    private jwtService: JwtService, 
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
  
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
  
    const payload = { email: user.email, sub: user.id };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio, 
        profileImageUrl: user.profileImageUrl, 
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
          profileImageUrl: imageUrl, 
        },
      });
  
      return { message: "Usuario registrado exitosamente", data: user };
    } catch (error) {
      console.error("Error en register:", error);
      throw new InternalServerErrorException("Error al registrar usuario");
    }
  }  

  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
