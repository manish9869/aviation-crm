import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AirportEmptylegControl } from '../../entities/airportemptylegcontrol.entity';
import { AirportemptylegcontrolDto } from '../../dto/airportemtylegcontrol.dto';
import { AirportEmptylegControlService } from '../../service/airportemptylegcontrol/airportemptylegcontrol.service';

@Controller('airportemptylegcontrol')
export class AirportEmptylegControlController {
  constructor(
    private readonly airportEmptylegControlService: AirportEmptylegControlService,
  ) {}

  @Post()
  async create(
    @Body() airportemptylegDto: AirportemptylegcontrolDto,
  ): Promise<AirportEmptylegControl> {
    try {
      return await this.airportEmptylegControlService.create(
        airportemptylegDto,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to create emptyleg',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<AirportEmptylegControl[]> {
    try {
      return await this.airportEmptylegControlService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch airportemptylegs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AirportEmptylegControl> {
    try {
      const emptyleg = await this.airportEmptylegControlService.findOne(id);
      if (!emptyleg) {
        throw new HttpException(
          'AirportEmptylegControl not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return emptyleg;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch emptyleg',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() airportemptylegDto: AirportemptylegcontrolDto,
  ): Promise<AirportEmptylegControl> {
    try {
      const emptyleg = await this.airportEmptylegControlService.update(
        id,
        airportemptylegDto,
      );
      if (!emptyleg) {
        throw new HttpException(
          'AirportEmptylegControl not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return emptyleg;
    } catch (error) {
      throw new HttpException(
        'Failed to update emptyleg',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.airportEmptylegControlService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete emptyleg',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
