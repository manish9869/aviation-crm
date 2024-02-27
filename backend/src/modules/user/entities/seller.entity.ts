import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  seller_id: number;

  @Column({ length: 45, nullable: false, unique: true })
  seller_commerical_name: string;

  @Column({ length: 45, nullable: false })
  seller_legal_name: string;

  @Column({ length: 150, nullable: false })
  address: string;

  @Column({ length: 15, nullable: false })
  tax_identification_number: string;

  @Column({ length: 45, nullable: false })
  contact_email: string;

  @Column({ length: 45, nullable: false })
  contact_name: string;

  @Column({ length: 45, nullable: false })
  contact_phone_number: string;

  @Column({ length: 150 })
  aoc_file: string;

  @Column({ length: 150 })
  legal_notary_file: string;

  @Column({nullable: false })
  enable: number;

  @Column({nullable: false })
  date_time_insert: Date;
}
