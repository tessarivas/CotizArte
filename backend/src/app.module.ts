// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ArtCategoriesModule } from './art-categories/art-categories.module';
import { ArtTypesModule } from './art-types/art-types.module';
import { ProjectsModule } from './projects/projects.module';
import { QuotesModule } from './quotes/quotes.module';
import { ArtTechniquesModule } from './art-techniques/art-techniques.module';
import { SoftwareModule } from './software/software.module';
import { DigitalToolsModule } from './digital-tools/digital-tools.module';
import { TraditionalMaterialsModule } from './traditional-materials/traditional-materials.module';	
import { TraditionalToolsModule } from './traditional-tools/traditional-tools.module';
import { ClientsModule } from './clients/clients.module';
import { PricingProfilesModule } from './pricing-profiles/pricing-profiles.module';
import { CommercialLicenseModule } from './commercial-licence/commercial-license.module';
import { DiscountsModule } from './discoutns/discount.module';
import { InitController } from './init/init.controller'; // ✅ AGREGAR

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CommonModule,
    ArtCategoriesModule,
    ArtTypesModule,
    ArtTechniquesModule,
    SoftwareModule,
    DigitalToolsModule,
    TraditionalMaterialsModule,
    TraditionalToolsModule,
    ProjectsModule,
    PricingProfilesModule,
    QuotesModule,
    ClientsModule,
    CommercialLicenseModule,
    DiscountsModule
  ],
  controllers: [AppController, InitController], // ✅ AGREGAR InitController
  providers: [AppService],
})
export class AppModule {}