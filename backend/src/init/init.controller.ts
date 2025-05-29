import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('init')
export class InitController {
  constructor(private prisma: PrismaService) {}

  @Get('db')
  async initializeDatabase() {
    try {
      await this.prisma.$executeRaw`SELECT 1`;
      console.log('✅ Conexión a la base de datos exitosa');

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
      const tables = await this.prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
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

  @Get('seed-my-data')
  async seedMyOriginalData() {
    try {      
      const categories = [
        {
          id: 1,
          name: "Arte Tradicional", 
          description: "Pintura y Dibujo"
        },
        {
          id: 2,
          name: "Arte Digital", 
          description: "Ilustración digital y Edición de Video"
        }
      ];

      for (const category of categories) {
        await this.prisma.artCategory.upsert({
          where: { id: category.id },
          update: {
            name: category.name,
            description: category.description
          },
          create: category
        });
      }

      const artTypes = [
        {
          id: 1,
          categoryId: 2,
          name: "Ilustración Digital",
          description: "Obras de arte realizadas por medios digitales",
          baseFormula: "(Horas trabajadas × Tarifa por hora) + (Costo de software + herramientas / Obras por mes) + Extra (modificaciones, urgencia, licencia comercial) + (Factor de nivel de detalle × Porcentaje adicional)"
        },
        {
          id: 2,
          categoryId: 2,
          name: "Edición de Video",
          description: "Producto realizado para proporsitos artisticos o comerciales.",
          baseFormula: "(Horas trabajadas × Tarifa por hora) + (Costo de software + herramientas / Obras por mes) + Extra (modificaciones, urgencia, licencia comercial) + (Factor de nivel de detalle × Porcentaje adicional)"
        },
        {
          id: 3,
          categoryId: 1,
          name: "Pintura",
          description: "Obras de arte por medios artisticos tradicionales.",
          baseFormula: "(Tamaño en cm² × Factor por técnica) + (Horas trabajadas × Tarifa por hora) + Costo de materiales + (Costo de herramientas / Obras por mes) + Extras (envío, urgencia)"
        },
        {
          id: 4,
          categoryId: 1,
          name: "Dibujo",
          description: "Obras de arte por medio tradicional en gráfito.",
          baseFormula: "(Tamaño en cm² × Factor por técnica) + (Horas trabajadas × Tarifa por hora) + Costo de materiales + (Costo de herramientas / Obras por mes) + Extras (envío, urgencia)"
        }
      ];

      for (const artType of artTypes) {
        await this.prisma.artType.upsert({
          where: { id: artType.id },
          update: {
            categoryId: artType.categoryId,
            name: artType.name,
            description: artType.description,
            baseFormula: artType.baseFormula
          },
          create: artType
        });
      }

      const techniques = [
        // Ilustración Digital
        {
          id: 1,
          artTypeId: 1,
          name: "Pixel Art",
          description: "Ilustración digital creada por medio de pixeles.",
          priceMultiplier: 1.2
        },
        {
          id: 2,
          artTypeId: 1,
          name: "Anime",
          description: "Ilustración digital basada en el estilo japonés.",
          priceMultiplier: 1.4
        },
        {
          id: 3,
          artTypeId: 1,
          name: "Vectorial",
          description: "Ilustración con curvas y escalado sin pérdida (Ej: Adobe Illustrator).",
          priceMultiplier: 1.3
        },
        {
          id: 4,
          artTypeId: 1,
          name: "Pintura digital",
          description: "Imitación de técnicas tradicionales con pinceles digitales (Ej: Photoshop).",
          priceMultiplier: 1.5
        },
        // Edición de Video
        {
          id: 5,
          artTypeId: 2,
          name: "Montaje lineal",
          description: "Edición básica de secuencias y transiciones.",
          priceMultiplier: 1.2
        },
        {
          id: 6,
          artTypeId: 2,
          name: "Motion Graphics",
          description: "Animación de gráficos 2D/3D (Ej: After Effects).",
          priceMultiplier: 1.8
        },
        {
          id: 7,
          artTypeId: 2,
          name: "Corrección de color",
          description: "Ajuste profesional de tonos y gamas cromáticas.",
          priceMultiplier: 1.4
        },
        {
          id: 8,
          artTypeId: 2,
          name: "Short Video",
          description: "Video corto para redes sociales",
          priceMultiplier: 1.4
        },
        // Pintura
        {
          id: 9,
          artTypeId: 3,
          name: "Óleo",
          description: "Pigmentos mezclados con aceites, secado lento. Alta durabilidad.",
          priceMultiplier: 1.4
        },
        {
          id: 10,
          artTypeId: 3,
          name: "Acrílico",
          description: "Pigmentos en emulsión acrílica. Secado rápido y versátil.",
          priceMultiplier: 1.2
        },
        {
          id: 11,
          artTypeId: 3,
          name: "Acuarela",
          description: "Pigmentos diluidos en agua. Efectos translúcidos.",
          priceMultiplier: 1.3
        },
        // Dibujo
        {
          id: 12,
          artTypeId: 4,
          name: "Lápiz grafito",
          description: "Técnica clásica con gradientes de grises.",
          priceMultiplier: 1.1
        },
        {
          id: 13,
          artTypeId: 4,
          name: "Carboncillo",
          description: "Líneas intensas y sombreados dramáticos.",
          priceMultiplier: 1.2
        },
        {
          id: 14,
          artTypeId: 4,
          name: "Tinta china",
          description: "Trazos definidos con tinta indeleble.",
          priceMultiplier: 1.3
        },
        {
          id: 15,
          artTypeId: 4,
          name: "Pastel",
          description: "Colores vibrantes con barras de pigmento en polvo.",
          priceMultiplier: 1.4
        }
      ];

      for (const technique of techniques) {
        await this.prisma.artTechnique.upsert({
          where: { id: technique.id },
          update: {
            artTypeId: technique.artTypeId,
            name: technique.name,
            description: technique.description,
            priceMultiplier: technique.priceMultiplier
          },
          create: technique
        });
      }

      console.log('✅ TODOS los datos originales cargados correctamente');
      
      return {
        success: true,
        message: '¡Datos originales de localhost restaurados! 🎉',
        data: {
          categories: categories.length,
          artTypes: artTypes.length,
          techniques: techniques.length
        }
      };
    } catch (error) {
      console.error('❌ Error al cargar datos originales:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('test-quotes')
  async testQuotes() {
    try {
      const quoteCount = await this.prisma.quote.count();
      return {
        success: true,
        message: 'Módulo de quotes funcionando',
        quoteCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('test-quotes-create')
  async testQuotesCreate() {
    try {
      const testQuote = {
        projectId: 1,
        basePrice: 100,
        finalPrice: 120,
        finalPriceAfterDiscount: 120,
        userId: 1,
        status: 'PENDING'
      };
      
      return {
        success: true,
        message: 'Estructura de quote válida',
        testData: testQuote
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('test-static')
  async testStaticFiles() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
      const exists = fs.existsSync(uploadsPath);
      
      let files = [];
      if (exists) {
        files = fs.readdirSync(uploadsPath);
      }
      
      return {
        success: true,
        uploadsPath,
        exists,
        files: files.slice(0, 10), // Primeros 10 archivos
        message: 'Información de archivos estáticos'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('create-uploads')
  async createUploadsFolder() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
      
      // Crear la carpeta si no existe
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
        console.log('✅ Carpeta uploads creada');
      }
      
      // Crear un archivo de ejemplo
      const testImagePath = path.join(uploadsPath, 'test-image.txt');
      fs.writeFileSync(testImagePath, 'Archivo de prueba para verificar uploads');
      
      return {
        success: true,
        message: 'Carpeta uploads creada correctamente',
        path: uploadsPath
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('update-software-schema')
  async updateSoftwareSchema() {
    try {
      console.log('🔄 Actualizando schema de software para agregar campo version...');
      
      // Verificar si la columna ya existe
      const checkColumn = await this.prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Software' AND column_name = 'version'
      `;
      
      if (Array.isArray(checkColumn) && checkColumn.length > 0) {
        return {
          success: true,
          message: 'El campo version ya existe en la tabla Software',
          alreadyExists: true
        };
      }
      
      // Agregar la columna version si no existe
      await this.prisma.$executeRaw`
        ALTER TABLE "Software" 
        ADD COLUMN "version" TEXT
      `;
      
      console.log('✅ Campo version agregado a tabla Software');
      
      await this.prisma.$executeRaw`
        UPDATE "Software" 
        SET "version" = '2024' 
        WHERE "version" IS NULL
      `;
      
      console.log('✅ Registros existentes actualizados con version por defecto');
      
      return {
        success: true,
        message: 'Campo version agregado correctamente a la tabla Software',
        updated: true
      };
      
    } catch (error) {
      console.error('❌ Error al actualizar schema de Software:', error);
      return {
        success: false,
        error: error.message,
        details: 'No se pudo agregar el campo version a la tabla Software'
      };
    }
  }

  @Get('sync-schema')
  async syncSchema() {
    try {
      console.log('🔄 Sincronizando schema completo...');
      
      // Ejecutar db push remotamente
      const { exec } = require('child_process');
      
      return new Promise((resolve) => {
        exec('npx prisma db push --force-reset', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Error en sync:', error);
            resolve({
              success: false,
              error: error.message,
              stderr,
              suggestion: 'Intenta usar el endpoint update-software-schema en su lugar'
            });
          } else {
            console.log('✅ Schema sincronizado:', stdout);
            resolve({
              success: true,
              message: 'Schema sincronizado correctamente',
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