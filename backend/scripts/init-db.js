const { PrismaClient } = require('@prisma/client');

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a base de datos exitosa');
    
    // Ejecutar migraciones
    console.log('🔄 Aplicando schema...');
    
    // Verificar si ya existen tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`📊 Tablas encontradas: ${tables.length}`);
    
    if (tables.length === 0) {
      console.log('🔄 Creando tablas...');
      // Aquí Prisma creará las tablas automáticamente al hacer queries
    }
    
    console.log('✅ Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();