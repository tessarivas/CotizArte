import { Controller, Post, Body, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('admin')
  async getAdminPanel() {
    const users = await this.authService.getAllUsers();
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>🎨 CotizArte - Admin</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
        .header { background: #4f46e5; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; flex: 1; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #4f46e5; }
        .users-container { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .user-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 10px 0; display: flex; align-items: center; gap: 15px; }
        .user-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; background: #ddd; display: flex; align-items: center; justify-content: center; }
        .user-info h3 { margin: 0; color: #333; }
        .user-info p { margin: 5px 0; color: #666; font-size: 0.9em; }
        .refresh-btn { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px 0; }
        .refresh-btn:hover { background: #059669; }
      </style>
      <script>
        // Auto-refresh cada 60 segundos
        setTimeout(() => window.location.reload(), 60000);
      </script>
    </head>
    <body>
      <div class="header">
        <h1>🎨 CotizArte - Panel de Administración</h1>
        <p>Monitoreo en tiempo real • Actualización: ${new Date().toLocaleString()}</p>
        <button class="refresh-btn" onclick="window.location.reload()">🔄 Actualizar Ahora</button>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">${users.length}</div>
          <p>Total Usuarios</p>
        </div>
        <div class="stat-card">
          <div class="stat-number">${users.filter(u => u.profileImageUrl).length}</div>
          <p>Con Foto de Perfil</p>
        </div>
        <div class="stat-card">
          <div class="stat-number">${users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24*60*60*1000)).length}</div>
          <p>Últimas 24h</p>
        </div>
      </div>
      
      <div class="users-container">
        <h2>👥 Usuarios Registrados</h2>
        ${users.map(user => `
          <div class="user-card">
            <div class="user-avatar">
              ${user.profileImageUrl 
                ? `<img src="${user.profileImageUrl}" alt="Perfil" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">` 
                : '👤'
              }
            </div>
            <div class="user-info">
              <h3>${user.name}</h3>
              <p>📧 ${user.email}</p>
              <p>📝 ${user.bio || 'Sin biografía'}</p>
              <p>📅 Registrado: ${new Date(user.createdAt).toLocaleDateString()} a las ${new Date(user.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </body>
    </html>`;
    
    return html;
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: '/tmp',
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
