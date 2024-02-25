import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['role_name'])
export class Roles {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ length: 45, nullable: false })
  role_name: string;

  @Column({ length: 100, nullable: false })
  role_description: string;
}
