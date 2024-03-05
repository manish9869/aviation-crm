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
import { EmptylegService } from '../../service/emptyleg/emptyleg.service';
import { Emptyleg } from '../../entities/emptyleg.entity';
import { EmptylegDto } from '../../dto/emptyleg.dto';
import { BookingDto } from '../../dto/booking.dto';

@Controller('emptyleg')
export class EmptylegController {
    constructor(private readonly emptylegService: EmptylegService) {}

    @Post()
    async create(@Body() emptylegDto: EmptylegDto): Promise<Emptyleg> {
      try {
        return await this.emptylegService.create(emptylegDto);
      } catch (error) {
        throw new HttpException(
          'Failed to create emptyleg',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Post('booking')
    async createbulk(@Body() bookingdto: BookingDto): Promise<Emptyleg> {
      try {
        return await this.emptylegService.createbooking(bookingdto);
      } catch (error) {
        throw new HttpException(
          'Failed to create emptyleg',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Get()
    async findAll(): Promise<Emptyleg[]> {
      try {
        return await this.emptylegService.findAll();
      } catch (error) {
        throw new HttpException(
          'Failed to fetch emptylegs',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Emptyleg> {
      try {
        const emptyleg = await this.emptylegService.findOne(id);
        if (!emptyleg) {
          throw new HttpException('Emptyleg not found', HttpStatus.NOT_FOUND);
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
      @Body() emptylegDto: EmptylegDto,
    ): Promise<Emptyleg> {
      try {
        const emptyleg = await this.emptylegService.update(id, emptylegDto);
        if (!emptyleg) {
          throw new HttpException('Emptyleg not found', HttpStatus.NOT_FOUND);
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
        await this.emptylegService.remove(id);
      } catch (error) {
        throw new HttpException(
          'Failed to delete emptyleg',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  