// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common'; // ✅ AGREGAR forwardRef
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy'; // ✅ VERIFICAR RUTA
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UsersModule), // ✅ USAR forwardRef
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || '1234567890',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // ✅ EXPORTAR TAMBIÉN JwtModule
})
export class AuthModule {}