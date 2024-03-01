// Import necessary modules
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  seller_id: number;

  @Column({ length: 45, nullable: false })
  seller_commercial_name: string;

  @Column({ length: 45, nullable: false })
  seller_legal_name: string;

  @Column()
  address: string;

  @Column()
  tax_identification_number: string;

  @Column()
  contact_email: string;

  @Column()
  contact_name: string;

  @Column()
  contact_phone_number: string;

  @Column({ type: 'json', nullable: true })
  aoc_file: object[];

  @Column({ type: 'json', nullable: true })
  legal_notary_file: object[];

  @Column()
  enable: number;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  date_time_insert: Date;
}
