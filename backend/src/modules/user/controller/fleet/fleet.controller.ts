import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FleetService } from '../../service/fleet/fleet.service';
import { FleetDto } from '../../dto/fleet.dto';
import { Fleet } from '../../entities/fleet.entity';
@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Post()
  async create(@Body() fleetDto: FleetDto): Promise<Fleet> {
    try {
      return await this.fleetService.create(fleetDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create fleet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<Fleet[]> {
    try {
      return await this.fleetService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch fleets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Fleet> {
    try {
      const fleet = await this.fleetService.findOne(id);
      if (!fleet) {
        throw new HttpException('Fleet not found', HttpStatus.NOT_FOUND);
      }
      return fleet;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch fleet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() fleetDto: FleetDto,
  ): Promise<Fleet> {
    try {
      const fleet = await this.fleetService.update(id, fleetDto);
      if (!fleet) {
        throw new HttpException('Fleet not found', HttpStatus.NOT_FOUND);
      }
      return fleet;
    } catch (error) {
      throw new HttpException(
        'Failed to update fleet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.fleetService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete fleet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
