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
      throw new InternalServerErrorException('Failed to create seller');
    }
  }

    @Get()
    async findAll(): Promise<Seller[]> {
      try {
        return await this.sellerService.findAll();
      } catch (error) {
        throw new InternalServerErrorException('Failed to fetch seller');
      }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Seller> {
      try {
        const seller = await this.sellerService.findOne(+id);
        if (!seller) {
          throw new NotFoundException('Seller not found');
        }
        return seller;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to fetch seller');
      }
    }

    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateSellerDto: SellerDto,
    ): Promise<Seller> {
      try {
        const seller = await this.sellerService.update(+id, updateSellerDto);
        if (!seller) {
          throw new NotFoundException('Seller not found');
        }
        return seller;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to update seller');
      }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      try {
        const deleted: any = await this.sellerService.remove(+id);
        console.log("-----------------> " + deleted);
        if (!deleted) {
          throw new NotFoundException('Seller not found');
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to delete seller');
      }
    }
  }
  
  


 