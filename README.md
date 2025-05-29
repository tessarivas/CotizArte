🎨 CotizArte - Sistema de Gestión y Cotización para Artistas
============================================================

📋 Descripción del Proyecto
---------------------------

CotizArte es una aplicación web completa diseñada para artistas independientes que necesitan gestionar sus proyectos, clientes y generar cotizaciones profesionales de manera automatizada. El sistema calcula precios basándose en múltiples factores como horas de trabajo, materiales, software utilizado, nivel de detalle y urgencia de entrega.

🛠️ Tecnologías Utilizadas
--------------------------

### **Frontend**

*   **React.js 18** - Framework principal de interfaz de usuario
    
*   **Vite** - Build tool y servidor de desarrollo de alta velocidad
    
*   **TailwindCSS** - Framework de CSS utility-first para estilos
    
*   **DaisyUI** - Componentes predefinidos basados en Tailwind
    
*   **TypeScript** - Lenguaje tipado para mayor robustez
    
*   **React Router DOM** - Sistema de enrutamiento SPA
    
*   **Axios** - Cliente HTTP para comunicación con API
    
*   **Lucide React** - Librería de iconos moderna y ligera
    
*   **PDFMake** - Generación de documentos PDF para cotizaciones
    
*   **MagicUI** - Componentes de animación y efectos visuales
    

### **Backend**

*   **Node.js** - Runtime de JavaScript del lado del servidor
    
*   **NestJS** - Framework empresarial basado en decoradores y módulos
    
*   **TypeScript** - Desarrollo tipado con mejor mantenibilidad
    
*   **Prisma ORM** - Object-Relational Mapping moderno y type-safe
    
*   **PostgreSQL** - Base de datos relacional robusta
    
*   **JWT (JSON Web Tokens)** - Sistema de autenticación stateless
    
*   **Passport.js** - Middleware de autenticación flexible
    
*   **bcrypt** - Hashing seguro de contraseñas
    
*   **Multer** - Middleware para manejo de archivos
    
*   **class-validator** - Validación declarativa de datos
    
*   **class-transformer** - Transformación de objetos
    

### **Servicios en la Nube**

*   **Cloudinary** - Almacenamiento y optimización de imágenes
    
*   **Vercel** - Hosting del frontend con CI/CD automático
    
*   **Railway/Render** - Despliegue del backend con contenedores
    
*   **PostgreSQL Cloud** - Base de datos como servicio
    

🏗️ Arquitectura del Sistema
----------------------------

### **Patrón Arquitectónico**

*   **Arquitectura en Capas (Layered Architecture)**
    
*   **Separación Cliente-Servidor**
    
*   **API RESTful** como capa de comunicación
    
*   **Patrón Repository** para acceso a datos
    
*   **Dependency Injection** en el backend
    

🚀 Despliegue y DevOps
---------------------------------------

### **Frontend (Vercel)**

*   **Plataforma**: Vercel para hosting estático
    
*   **CI/CD**: Integración automática con Git
    
*   **Configuración**: vercel.json para SPA routing
    

### **Backend (Render)**

*   **Containerización**: Docker para consistencia de entorno
    
*   **Variables de Entorno**: Configuración segura de credenciales
    
*   **Health Checks**: Endpoints de monitoreo automático
    
*   **Scaling**: Auto-scaling basado en carga
    

### **Base de Datos**

*   **PostgreSQL en la nube** (Supabase/Railway)
    
*   **Migrations**: Versionado automático con Prisma
    
*   **Backups**: Respaldos automáticos diarios
    
*   **Connection Pooling**: Optimización de conexiones


🔐 Sistema de Autenticación y Seguridad
---------------------------------------

### **Estrategia de Autenticación**

*   **JWT (JSON Web Tokens)** para autenticación stateless
    
*   **Passport.js** con estrategia JWT personalizada
    
*   **Refresh Tokens** para sesiones de larga duración
    
*   **Role-based Access Control** (preparado para futuras expansiones)
    

**Medidas de Seguridad Implementadas**

*   **Hashing de contraseñas** con bcrypt (salt rounds: 12)
    
*   **Validación de entrada** con class-validator en todos los endpoints
    
*   **CORS configurado** para dominios específicos
    
*   **Rate limiting** para prevenir ataques de fuerza bruta
    
*   **Sanitización de datos** antes de almacenamiento
    
*   **Guards de autenticación** en rutas protegidas
    
*   **Validación de JWT** en cada request protegido
    

🔧 Instalación y Configuración
---------------------------------------

### **Requisitos del Sistema**

*   Node.js 18+ LTS
    
*   PostgreSQL 14+
    
*   npm/yarn
    
*   Git

*   Variables de entorno requeridas*


### **Instalación Local**
\# Clonar repositorio
```
git clone https://github.com/usuario/cotizarte.git
cd cotizarte
```
\# Backend
```
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev
```
\# Frontend
```
cd ../frontend
npm install
npm run dev
```

📞 Contacto
-----------

*   **Email**: rivas.teresa@hotmail.com
    
*   **GitHub**: @tessarivas