import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  currency_Id: number;

  @Column()
  currency_name: string;

  @Column()
  currency_abbreviation: string;
}
