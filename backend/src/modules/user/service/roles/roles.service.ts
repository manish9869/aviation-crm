import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from '../../dto/roles.dto';
import { Roles } from '../../entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
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

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
