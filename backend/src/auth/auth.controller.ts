import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: '/tmp', // ✅ Usar directorio temporal
      filename: (req, file, cb) => {
        const fileExt = extname(file.originalname);
        const allowedTypes = ['.png', '.jpg', '.jpeg'];
        
        if (!allowedTypes.includes(fileExt)) {
          return cb(new Error('Formato de imagen no permitido'), '');
        }
        
        cb(null, `${Date.now()}${fileExt}`);
      },
    }),
  }))
  register(@Body() registerDto: RegisterDto, @UploadedFile() file: Express.Multer.File) {
    return this.authService.register(registerDto, file);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
