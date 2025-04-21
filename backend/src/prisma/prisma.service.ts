// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'development') {
      // Solo para entorno de desarrollo
      const models = Reflect.ownKeys(this).filter(key => key[0] !== '_' && key[0] !== '$');
      return Promise.all(models.map(modelKey => this[modelKey].deleteMany()));
    }
  }
}