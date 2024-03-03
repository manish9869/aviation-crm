import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SellerService } from '../../service/seller/seller.service';
import { Seller } from '../../entities/seller.entity';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  async create(@Body() sellerData: Partial<Seller>): Promise<Seller> {
    return await this.sellerService.create(sellerData);
  }

  @Get()
  async findAll(): Promise<Seller[]> {
    return await this.sellerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Seller> {
    return this.sellerService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() sellerData: Partial<Seller>,
  ): Promise<Seller> {
    return await this.sellerService.update(+id, sellerData);
  }

  @Put('/media/:id')
  async updateMedia(
    @Param('id') id: string,
    @Body() mediaArray: Partial<any>,
  ): Promise<Seller> {
    return await this.sellerService.updateMedia(+id, mediaArray);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.sellerService.remove(+id);
  }
}
