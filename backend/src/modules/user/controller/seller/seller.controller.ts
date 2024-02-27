import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
    InternalServerErrorException,
    UseGuards,
  } from '@nestjs/common';
  import { SellerDto } from '../../dto/seller.dto';
  import { Seller } from '../../entities/seller.entity';
  import { SellerService } from '../../service/seller/seller.service';
  import { AuthGuard } from 'src/modules/auth/auth.guard';
  
  @Controller('seller')
  export class SellerController {
    constructor(private readonly sellerService: SellerService) {}
  

    @Post()
  async create(@Body() createSeller: SellerDto): Promise<Seller> {
    try {
      return await this.sellerService.create(createSeller);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create role');
    }
  }

    @Get()
    async findAll(): Promise<Seller[]> {
      try {
        return await this.sellerService.findAll();
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch roles');
      }
    }
  }