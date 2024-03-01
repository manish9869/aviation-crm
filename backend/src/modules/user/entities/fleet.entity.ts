import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seller } from './seller.entity';
import { Currency } from './currency.entity';
import { Category } from './category.entity';

@Entity({ name: 'fleet' })
export class Fleet {
  @PrimaryGeneratedColumn()
  fleet_id: number;

  @ManyToOne(() => Seller, { eager: true })
  @JoinColumn({ name: 'seller_id' })
  seller: number;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_Id' })
  currency: number;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: number;

  // @Column('bigint', { name: 'seller_id' })
  // sellerId: string;

  // @Column('bigint', { name: 'currency_id' })
  // currencyId: string;

  // @Column('bigint', { name: 'category_id' })
  // categoryId: string;

  @Column({ length: 10, nullable: false })
  tail_number: string;

  @Column({ nullable: true })
  knots_speed: number;

  @Column('float', {
    nullable: true,
    precision: 12,
    default: () => "'0'",
  })
  max_range_nm: number;

  @Column({ nullable: false })
  pax_number: number;

  @Column({ length: 45, nullable: false })
  brand: string;

  @Column({ length: 45, nullable: false })
  model: string;

  @Column({ nullable: true, length: 150 })
  photo_interior: string;

  @Column({ nullable: true, length: 150 })
  photo_exterior: string;

  @Column('decimal', {
    name: 'hour_price',
    nullable: true,
    precision: 11,
    scale: 2,
  })
  hour_price: string;

  @Column({ nullable: false })
  yom: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_time_insert: Date;
}
