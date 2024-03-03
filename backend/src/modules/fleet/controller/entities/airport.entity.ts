import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'airport' })
export class Airport {
  @PrimaryGeneratedColumn()
  airport_id: number;

  @Column()
  airportname: string;

  @Column()
  airportiatacode: string;

  @Column()
  airporticaocode: string;

  @Column()
  city: string;

  @Column()
  countryname: string;
}
