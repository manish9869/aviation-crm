import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEmptylegControl } from '../../entities/airportemptylegcontrol.entity';
import { Repository } from 'typeorm';
import { AirportemptylegcontrolDto } from '../../dto/airportemtylegcontrol.dto';

@Injectable()
export class AirportEmptylegControlService {
  constructor(
    @InjectRepository(AirportEmptylegControl)
    private readonly airportemtylegcontrolRepository: Repository<AirportEmptylegControl>,
  ) {}

  async createBulk(
    emptylegDtos: AirportemptylegcontrolDto[],
  ): Promise<AirportEmptylegControl[]> {
    const emptylegs = emptylegDtos.map(dto => this.airportemtylegcontrolRepository.create(dto));
    return await this.airportemtylegcontrolRepository.save(emptylegs);
  }

  async create(
    emptylegDto: AirportemptylegcontrolDto,
  ): Promise<AirportEmptylegControl> {
    console.log('========> ' + JSON.stringify(emptylegDto));
    const emptyleg = this.airportemtylegcontrolRepository.create(emptylegDto);
    console.log('============+++++++++====> ' + JSON.stringify(emptyleg));
    return await this.airportemtylegcontrolRepository.save(emptyleg);
  }

  async findAll(): Promise<AirportEmptylegControl[]> {
    return await this.airportemtylegcontrolRepository.find();
  }

  async findOne(id: number): Promise<AirportEmptylegControl> {
    return await this.airportemtylegcontrolRepository.findOne({
      where: { airportemptyleg_id: id },
    });
  }

  async update(
    id: number,
    emptylegDto: AirportemptylegcontrolDto,
  ): Promise<AirportEmptylegControl> {
    const existingAirportEmptylegControl =
      await this.airportemtylegcontrolRepository.findOne({
        where: { airportemptyleg_id: id },
        relations: ['emptyleg', 'airport', 'flighttype'],
      });
    if (!existingAirportEmptylegControl) {
      throw new NotFoundException(
        `AirportEmptylegControl with id ${id} not found`,
      );
    }

    // Update the emptyleg entity with data from the emptylegDto
    Object.assign(existingAirportEmptylegControl, emptylegDto);

    // Save the updated emptyleg entity
    return await this.airportemtylegcontrolRepository.save(
      existingAirportEmptylegControl,
    );
  }

  async remove(id: number): Promise<void> {
    await this.airportemtylegcontrolRepository.delete(id);
  }
}
