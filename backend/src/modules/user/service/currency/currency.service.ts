import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../../entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(currencyData: Partial<Currency>): Promise<Currency> {
    const currency = this.currencyRepository.create(currencyData);
    return await this.currencyRepository.save(currency);
  }

  async findAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async findOne(id: number): Promise<Currency> {
    return await this.currencyRepository.findOne({where: { currency_Id: id },
    });
  }

  async update(id: number, currencyData: Partial<Currency>): Promise<Currency> {
    await this.currencyRepository.update(id, currencyData);
    return await this.currencyRepository.findOne({
      where: { currency_Id: id },
    });
  }

  async remove(id: number): Promise<void> {
    await this.currencyRepository.delete(id);
  }
}
