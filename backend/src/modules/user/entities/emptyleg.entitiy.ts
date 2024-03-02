// Import necessary modules
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ length: 60, nullable: false, unique: true })
  category_name: string;
}
