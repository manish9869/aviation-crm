import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Currency } from './currency.entity';
import { Fleet } from './fleet.entity';

@Entity({ name: 'empty_leg' })
export class Emptyleg {
  @PrimaryGeneratedColumn()
  empty_leg_id: number;

  @ManyToOne(() => Fleet, { eager: true })
  @JoinColumn({ name: 'fleet_id' })
  fleet: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'login_user_id' })
  user: number;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_Id' })
  currency: number;

  @Column({ nullable: false })
  initial_date: Date;

  @Column({ nullable: false })
  initial_time: String;

  @Column({ nullable: false })
  departure_date: Date;

  @Column({ nullable: false })
  departure_time: String;

  @Column({ nullable: false })
  numpax: number;

  @Column('decimal', { precision: 11, scale: 2, nullable: false })
  price_full_aircraft: string;

  @Column('decimal', { precision: 11, scale: 2, nullable: false })
  price_per_seat: string;

  @Column({ nullable: true, length: 300 })
  app_amenities_detail: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date_time_insert: Date;
}
