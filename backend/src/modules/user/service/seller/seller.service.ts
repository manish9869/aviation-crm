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

      seller.date_time_insert = new Date();

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

  async findOne(id: number): Promise<Seller> {
    return await this.sellerRepository.findOne({ where: { seller_id: id } });
  }

  async update(id: number, updateSellerDto: SellerDto): Promise<Seller> {
    const seller = await this.sellerRepository.preload({
      seller_id: id,
      ...updateSellerDto,
    })
    return await this.sellerRepository.save(seller);
  }

  async remove(id: number): Promise<number> {
    try {
      const deleteResult = await this.sellerRepository.delete(id);
    console.log('deleteResult.affected', deleteResult.affected);
    if (deleteResult.affected !== 0) {
      return id; // Return the deleted role ID
    }
    } catch (error) {
      console.error('Error deleting seller:', error);
      throw error;
    }
  }

}



