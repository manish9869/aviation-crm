import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from '../../dto/roles.dto';
import { Roles } from '../../entities/roles.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRoleDto: RoleDto): Promise<Roles> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Roles[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Roles> {
    return await this.roleRepository.findOne({ where: { role_id: id } });
  }

  async update(id: number, updateRoleDto: RoleDto): Promise<Roles> {
    const role = await this.roleRepository.preload({
      role_id: id,
      ...updateRoleDto,
    });

    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<number | undefined> {
    // Check if there are any references to this role in the user table
    const usersWithRoleId = await this.userRepository.find({
      where: { role: id }, // Use role_id instead of role
    });

    if (usersWithRoleId.length > 0) {
      // Handle the case where there are referencing rows in the user table
      // For example, you could update these rows to reference a different role or set the role ID to null
      for (const user of usersWithRoleId) {
        user.role = null; // Set roleId to null for simplicity, but you might want to update it to a different role ID
        await this.userRepository.save(user);
      }
    }

    // Now that the referencing rows have been handled, delete the role from the roles table
    const deleteResult = await this.roleRepository.delete(id);
    console.log('deleteResult.affected', deleteResult.affected);
    if (deleteResult.affected !== 0) {
      return id; // Return the deleted role ID
    }
  }
}
