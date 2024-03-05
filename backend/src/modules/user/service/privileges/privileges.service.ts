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

  async createOrUpdate(privileges: Partial<Privileges>): Promise<Privileges> {
    if (privileges.privilege_id) {
      // If privileges object has an id, it's an update operation
      const existingPrivilege = await this.privilegesRepository.findOne({
        where: { privilege_id: privileges.privilege_id },
      });
      if (!existingPrivilege) {
        throw new Error(
          `Privilege with id ${privileges.privilege_id} not found.`,
        );
      }

      // Update existing privilege with the provided data
      const updatedPrivilege = await this.privilegesRepository.save({
        ...existingPrivilege,
        ...privileges,
      });

      return updatedPrivilege;
    } else {
      // If no id is provided, it's an add operation
      return await this.privilegesRepository.save(privileges);
    }
  }

  async findAll(): Promise<Privileges[]> {
    return await this.privilegesRepository.find();
  }

  async findPrivilegesByRole(id): Promise<Privileges> {
    id = parseInt(id);
    return await this.privilegesRepository.findOne({
      where: { role: id },
    });
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
