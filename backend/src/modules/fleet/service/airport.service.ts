import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from '../controller/entities/airport.entity';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async create(airportData: Partial<Airport>): Promise<Airport> {
    const airport = await this.airportRepository.create(airportData);
    return this.airportRepository.save(airport);
  }
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
  ): Promise<{
    data: Airport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (page - 1) * pageSize;
    let queryBuilder = this.airportRepository.createQueryBuilder('airport');

    // Add search condition if searchTerm is provided
    if (searchTerm) {
      queryBuilder = queryBuilder
        .where('airport.airportname LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('airport.airportiatacode LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere('airport.airporticaocode LIKE :searchTerm', {
          searchTerm: `%${searchTerm}%`,
        });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return { data: data, total, page, pageSize };
  }

  async findOne(id: number): Promise<Airport> {
    return this.airportRepository.findOne({ where: { airport_id: id } });
  }

  async update(id: number, airportData: Partial<Airport>): Promise<Airport> {
    await this.airportRepository.update(id, airportData);
    return this.airportRepository.findOne({ where: { airport_id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.airportRepository.delete(id);
  }
}
