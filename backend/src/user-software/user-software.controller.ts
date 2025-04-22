import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserSoftwareService } from './user-software.service';
import { CreateUserSoftwareDto } from './dto/create-user-software.dto';
import { UpdateUserSoftwareDto } from './dto/update-user-software.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('user-software')
@UseGuards(JwtAuthGuard)
export class UserSoftwareController {
  constructor(private readonly userSoftwareService: UserSoftwareService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body() dto: CreateUserSoftwareDto
  ) {
    return this.userSoftwareService.create(user.id, dto);
  }

  @Get()
  findAllByUser(@GetUser() user: User) {
    return this.userSoftwareService.findAllByUser(user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserSoftwareDto: UpdateUserSoftwareDto,
  ) {
    return this.userSoftwareService.update(id, updateUserSoftwareDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSoftwareService.remove(id);
  }
}