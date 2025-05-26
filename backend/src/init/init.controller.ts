import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  @Get('create-test-user')
  async createTestUser() {
    try {
      console.log('🔄 Creando usuario de prueba...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      // Verificar si el usuario ya existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: 'test@test.com' }
      });

      if (existingUser) {
        return {
          success: true,
          message: 'Usuario de prueba ya existe',
          user: {
            email: 'test@test.com',
            password: '123456'
          }
        };
      }
      
      const testUser = await this.prisma.user.create({
        data: {
          email: 'test@test.com',
          password: hashedPassword,
          name: 'Usuario',
        }
      });
      
      console.log('✅ Usuario de prueba creado');
      
      return {
        success: true,
        message: 'Usuario de prueba creado correctamente',
        user: {
          email: 'test@test.com',
          password: '123456'
        }
      };
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('logs')
  async checkTables() {
    try {
      console.log('🔍 Verificando tablas...');
      
      // Verificar qué tablas existen
      const tables = await this.prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      // Contar usuarios
      const userCount = await this.prisma.user.count();
      
      return {
        success: true,
        tables,
        userCount,
        message: 'Información de la base de datos'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}