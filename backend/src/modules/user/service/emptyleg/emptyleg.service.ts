import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emptyleg } from '../../entities/emptyleg.entity';
import { EmptylegDto } from '../../dto/emptyleg.dto';
import { BookingDto } from '../../dto/booking.dto';
import { FLIGHT_SOURCE } from 'src/constants/common';
import { AirportEmptylegControlService } from '../airportemptylegcontrol/airportemptylegcontrol.service';

@Injectable()
export class EmptylegService {
  constructor(
    @InjectRepository(Emptyleg)
    private readonly emptylegRepository: Repository<Emptyleg>,

    private readonly emptylegControlService: AirportEmptylegControlService,
  ) {}

  async createbooking(bookingdto: BookingDto): Promise<Emptyleg> {
    console.log('bookingdto => ', bookingdto);
    const emptylegReqBody: EmptylegDto = {
      fleet: bookingdto.fleet,
      user: 1,
      currency: bookingdto.currency,
      initial_date: bookingdto.initial_date,
      initial_time: bookingdto.initial_time,
      departure_date: bookingdto.departure_date,
      departure_time: bookingdto.departure_time,
      numpax: bookingdto.numpax,
      price_full_aircraft: bookingdto.price_full_aircraft,
      price_per_seat: bookingdto.price_per_seat,
      app_amenities_detail: bookingdto.app_amenities_detail,
    };

    console.log('emptylegReqBody = >', emptylegReqBody);
    const emptylegResponse = await this.create(emptylegReqBody);

    console.log('emptylegResponse ===> ', emptylegResponse);

    const EmptylegControlBody = [
      {
        fbo_name: bookingdto.fbo_source,
        airport: bookingdto.airport_source,
        flightype: FLIGHT_SOURCE.SOURCE,
        emptyleg: emptylegResponse.empty_leg_id,
      },
      {
        fbo_name: bookingdto.fbo_destination,
        airport: bookingdto.airport_destination,
        flightype: FLIGHT_SOURCE.DESTINATION,
        emptyleg: emptylegResponse.empty_leg_id,
      },
    ];

    console.log('EmptylegControlBody ===> ', EmptylegControlBody);

    const emptylegcontrolresponse =
      this.emptylegControlService.createBulk(EmptylegControlBody);

      console.log("emptylegcontrolresponse" + emptylegcontrolresponse);
    return emptylegResponse;
  }

  async create(emptylegDto: EmptylegDto): Promise<Emptyleg> {
    const emptyleg = this.emptylegRepository.create(emptylegDto);
    return await this.emptylegRepository.save(emptyleg);
  }

  async findAll(): Promise<Emptyleg[]> {
    return await this.emptylegRepository.find();
  }

  async findOne(id: number): Promise<Emptyleg> {
    return await this.emptylegRepository.findOne({
      where: { empty_leg_id: id },
    });
  }

  async update(id: number, emptylegDto: EmptylegDto): Promise<Emptyleg> {
    const existingEmptyleg = await this.emptylegRepository.findOne({
      where: { empty_leg_id: id },
      relations: ['fleet', 'currency', 'user'],
    });
    if (!existingEmptyleg) {
      throw new NotFoundException(`Emptyleg with id ${id} not found`);
    }

    // Update the emptyleg entity with data from the emptylegDto
    Object.assign(existingEmptyleg, emptylegDto);

    // Save the updated emptyleg entity
    return await this.emptylegRepository.save(existingEmptyleg);
  }

  async remove(id: number): Promise<void> {
    await this.emptylegRepository.delete(id);
  }
}
