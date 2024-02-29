import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../../entities/user-type.entity';
import { UserTypeDto } from '../../dto/userType.dto';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  async create(userTypeDto: UserTypeDto): Promise<UserType> {
    const userType = this.userTypeRepository.create(userTypeDto);
    return await this.userTypeRepository.save(userType);
  }

  async findAll(): Promise<UserType[]> {
    return await this.userTypeRepository.find();
  }

  async findOne(id: number): Promise<UserType> {
    return await this.userTypeRepository.findOne({
      where: { login_user_type_id: id },
    });
  }

  async update(id: number, userTypeDto: UserTypeDto): Promise<UserType> {
    const userType = await this.userTypeRepository.preload({
      login_user_type_id: id,
      ...userTypeDto,
    });
    return await this.userTypeRepository.save(userType);
  }

  async remove(id: number): Promise<void> {
    await this.userTypeRepository.delete(id);
  }
}
