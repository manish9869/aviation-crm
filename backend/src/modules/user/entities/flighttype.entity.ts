import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AirportEmptylegControl } from './airportemptylegcontrol.entity';

@Entity({ name: 'flight_type' })
export class FlightType {
  @PrimaryGeneratedColumn()
  flight_type_id: number;

  @Column('varchar', { name: 'flight_type', unique: true, length: 45 })
  flight_type: string;
}
