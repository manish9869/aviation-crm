import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Airport } from 'src/modules/fleet/controller/entities/airport.entity';
import { FlightType } from './flighttype.entity';
import { Emptyleg } from './emptyleg.entity';

@Entity({ name: 'airport_emptyleg_control' })
export class AirportEmptylegControl {
  @PrimaryGeneratedColumn()
  airportemptyleg_id: number;

  @ManyToOne(() => Emptyleg, { eager: true })
  @JoinColumn({ name: 'empty_leg_id' })
  emptyleg: number;

  @ManyToOne(() => Airport, { eager: true })
  @JoinColumn({ name: 'airport_id' })
  airport: number;

  @ManyToOne(() => FlightType, { eager: true })
  @JoinColumn({ name: 'flight_type_id' })
  flightype: number;

  @Column({ nullable: true, length: 45 })
  fbo_name: string;
}
