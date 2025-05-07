import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

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
}