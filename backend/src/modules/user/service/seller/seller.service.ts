import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerDto } from '../../dto/seller.dto';
import { Seller } from '../../entities/seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async create(seller: SellerDto): Promise<Seller> {
    try {
      console.log('++++++++++++++++++++++');

      seller.dateTimeInsert = new Date(seller.dateTimeInsert);

      const createdSeller = this.sellerRepository.create(seller);
      console.log('------------>' + JSON.stringify(createdSeller));
      const savedSeller = await this.sellerRepository.save(createdSeller);
      return savedSeller;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    }
  }

  async findAll(): Promise<Seller[]> {
    try {
      const sellers = await this.sellerRepository.find();
      console.log('Fetched sellers:', sellers);
      return sellers;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw new InternalServerErrorException('Failed to fetch sellers');
    }
  }
}
