import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from '../controller/entities/airport.entity';

import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
    private readonly redisService: RedisService,
  ) {}

  async create(airportData: Partial<Airport>): Promise<Airport> {
    const airport = await this.airportRepository.create(airportData);
    return this.airportRepository.save(airport);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    sortField: string = '',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{
    data: Airport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      console.log('pageSize', pageSize);
      const cacheKey = `airports:all`;
      page = parseInt(page.toString(), 10);
      pageSize = parseInt(pageSize.toString(), 10);

      let data: Airport[] = [];

      // Check if the data is cached in Redis
      const cachedData = await this.redisService.getClient().get(cacheKey);

      if (cachedData) {
        console.log('Inside Cache');
        data = JSON.parse(cachedData);
      } else {
        console.log('API hit');
        // Fetch all records from the database
        data = await this.airportRepository.find();

        // Cache the data in Redis
        await this.redisService
          .getClient()
          .set(cacheKey, JSON.stringify(data), 'EX', 7200);
      }

      // Apply search filter if searchTerm is provided
      if (searchTerm) {
        console.log('searchTerm', searchTerm);
        data = data.filter((airport: Airport) =>
          this.isMatched(airport, searchTerm),
        );
      }

      // Apply sorting if sortField is provided
      if (sortField) {
        console.log('sortField', sortField);
        data.sort((a: Airport, b: Airport) => {
          const fieldA = a[sortField];
          const fieldB = b[sortField];
          return sortOrder === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        });
      }

      const total = data.length;
      let startIndex = 0;
      let endIndex = 0;

      if (pageSize == -1) {
        startIndex = 1;
        endIndex = total;
      } else {
        startIndex = (page - 1) * pageSize;
        endIndex = Math.min(startIndex + pageSize, total);
      }

      const paginatedData = data.slice(startIndex, endIndex);

      return { data: paginatedData, total, page, pageSize };
    } catch (error) {
      // Handle errors appropriately
      console.error('Error occurred:', error);
      throw error;
    }
  }

  private isMatched(airport: Airport, searchTerm: string): boolean {
    // Convert search term to lowercase and create a case-insensitive regex
    const regex = new RegExp(searchTerm.toLowerCase(), 'i');

    // Test if any property of the airport matches the search term
    return (
      regex.test(airport.airportname.toLowerCase()) ||
      regex.test(airport.airportiatacode.toLowerCase()) ||
      regex.test(airport.airporticaocode.toLowerCase())
    );
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
