import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'role' })
export class Roles {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ length: 45, nullable: false })
  role_name: string;

  @Column({ length: 100, nullable: false })
  role_description: string;
}
