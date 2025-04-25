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
import { UserSoftwareModule } from './user-software/user-software.module';
import { ClientsModule } from './clients/clients.module';
import { PricingProfilesModule } from './pricing-profiles/pricing-profiles.module';
import { CommercialLicenseModule } from './commercial-licence/commercial-license.module';
import { DiscountsModule } from './discoutns/discount.module';

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
    UserSoftwareModule,
    ProjectsModule,
    PricingProfilesModule,
    QuotesModule,
    ClientsModule,
    CommercialLicenseModule,
    DiscountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}