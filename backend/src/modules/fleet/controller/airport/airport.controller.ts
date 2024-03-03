import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AirportService } from '../../service/airport.service';
import { Airport } from '../entities/airport.entity';

@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Post()
  async create(@Body() airportData: Partial<Airport>): Promise<Airport> {
    return this.airportService.create(airportData);
  }
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchTerm') searchTerm: string = '',
  ): Promise<{
    data: Airport[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return this.airportService.findAll(page, pageSize, searchTerm);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Airport> {
    return this.airportService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() airportData: Partial<Airport>,
  ): Promise<Airport> {
    return this.airportService.update(+id, airportData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.airportService.remove(+id);
  }
}
