import { Module, forwardRef } from '@nestjs/common'; // ✅ AGREGAR forwardRef
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    // ✅ REMOVER cualquier importación de AuthModule aquí
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}