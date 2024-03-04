import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Privileges } from '../../entities/privileges.entity';

@Injectable()
export class PrivilegesService {
  constructor(
    @InjectRepository(Privileges)
    private readonly privilegesRepository: Repository<Privileges>,
  ) {}

  async create(privileges: Partial<Privileges>): Promise<Privileges> {
    return await this.privilegesRepository.save(privileges);
  }

  async findAll(): Promise<Privileges[]> {
    return await this.privilegesRepository.find();
  }

  async findOne(id: number): Promise<Privileges> {
    return await this.privilegesRepository.findOne({
      where: { privilege_id: id },
    });
  }

  async update(
    id: number,
    privileges: Partial<Privileges>,
  ): Promise<Privileges> {
    await this.privilegesRepository.update(id, privileges);
    return await this.privilegesRepository.findOne({
      where: { privilege_id: id },
    });
  }

  async remove(id: number): Promise<void> {
    await this.privilegesRepository.delete(id);
  }
}
