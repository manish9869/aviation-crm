import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { login_user_id: id },
    });
  }

  async findByEmail(mail: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndMapMany(
        'role.privileges',
        'Privileges',
        'privileges',
        'privileges.role_id = role.role_id',
      )
      .leftJoinAndSelect('user.user_type', 'user_type') // Add relation for user_type
      .leftJoinAndSelect('user.seller', 'seller') // Add relation for seller
      .where('user.email = :email', { email: mail })
      .getOne();
  }

  async update(id: number, userDto: UserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { login_user_id: id },
      relations: ['role', 'user_type', 'seller'],
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update the user entity with data from the userDto
    Object.assign(existingUser, userDto);

    // Save the updated user entity
    return await this.userRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
