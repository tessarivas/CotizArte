import { Controller, Post, Get, Put, Delete, UseGuards, Body, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@GetUser('id') userId: number, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.quotesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.quotesService.findOne(id, userId);
  }

  @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @GetUser('id') userId: number,
      @Body() updateData: UpdateQuoteDto
    ) {
      console.log("Controller Update llamado con:", updateData);
      return this.quotesService.update(id, userId, updateData);
  }


  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.quotesService.delete(id, userId);
  }
}