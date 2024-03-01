import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fleet } from '../../entities/fleet.entity';
import { Repository } from 'typeorm';
import { FleetDto } from '../../dto/fleet.dto';

@Injectable()
export class FleetService {
    constructor(
        @InjectRepository(Fleet)
        private readonly fleetRepository: Repository<Fleet>,
      ) {}
    
      async create(fleetDto: FleetDto): Promise<Fleet> {
        const user = this.fleetRepository.create(fleetDto);
        return await this.fleetRepository.save(user);
      }
    
      async findAll(): Promise<Fleet[]> {
        return await this.fleetRepository.find();
      }
    
      async findOne(id: number): Promise<Fleet> {
        return await this.fleetRepository.findOne({
          where: { fleet_id: id },
        });
      }
    
      async update(id: number, fleetDto: FleetDto): Promise<Fleet> {
        const existingFleet = await this.fleetRepository.findOne({
          where: { fleet_id: id },
          relations: ['seller', 'currency', 'category'],
        });
        if (!existingFleet) {
          throw new NotFoundException(`Fleet with id ${id} not found`);
        }
    
        // Update the user entity with data from the fleetDto
        Object.assign(existingFleet, fleetDto);
    
        // Save the updated user entity
        return await this.fleetRepository.save(existingFleet);
      }
    
      async remove(id: number): Promise<void> {
        await this.fleetRepository.delete(id);
      }
    }
    
