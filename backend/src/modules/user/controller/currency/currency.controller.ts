import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { Currency } from '../../entities/currency.entity';
import { CurrencyService } from '../../service/currency/currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  async create(@Body() currencyData: Partial<Currency>): Promise<Currency> {
    return await this.currencyService.create(currencyData);
  }

  @Get()
  async findAll(): Promise<Currency[]> {
    return await this.currencyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Currency> {
    return this.currencyService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() currencyData: Partial<Currency>,
  ): Promise<Currency> {
    return await this.currencyService.update(+id, currencyData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.currencyService.remove(+id);
  }
}
