import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../../entities/seller.entity';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async create(sellerData: Partial<Seller>): Promise<Seller> {
    const seller = this.sellerRepository.create(sellerData);
    return await this.sellerRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return await this.sellerRepository.find();
  }

  async findOne(id: number): Promise<Seller> {
    return await this.sellerRepository.findOne({ where: { seller_id: id } });
  }

  async update(id: number, sellerData: Partial<Seller>): Promise<Seller> {
    await this.sellerRepository.update(id, sellerData);
    return await this.sellerRepository.findOne({ where: { seller_id: id } });
  }

  async updateMedia(id: number, mediaArray): Promise<any> {
    await this.sellerRepository.update(id, mediaArray);
    return await this.sellerRepository.findOne({ where: { seller_id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.sellerRepository.delete(id);
  }
}
