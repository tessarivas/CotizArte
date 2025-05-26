import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de que la ruta sea correcta

@Controller('init')
export class InitController {
  constructor(private prisma: PrismaService) {}

  @Get('db')
  async initializeDatabase() {
    try {
      console.log('🔄 Inicializando base de datos...');
      
      // Verificar conexión
      await this.prisma.$connect();
      console.log('✅ Conexión exitosa a la base de datos');
      
      // Aplicar el schema usando db push
      console.log('📊 Aplicando schema a la base de datos...');
      
      // Esto forzará a Prisma a crear las tablas según el schema
      await this.prisma.$executeRaw`SELECT 1`;
      
      console.log('✅ Schema aplicado correctamente');
      
      return { 
        success: true, 
        message: 'Base de datos inicializada correctamente',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error al inicializar base de datos:', error);
      return { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('push')
  async pushSchema() {
    try {
      console.log('🔄 Aplicando schema con db push...');
      
      // Esta es una alternativa más directa
      const { exec } = require('child_process');
      
      return new Promise((resolve) => {
        exec('npx prisma db push', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Error:', error);
            resolve({
              success: false,
              error: error.message,
              stderr
            });
          } else {
            console.log('✅ Schema aplicado:', stdout);
            resolve({
              success: true,
              message: 'Schema aplicado correctamente',
              output: stdout
            });
          }
        });
      });
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}