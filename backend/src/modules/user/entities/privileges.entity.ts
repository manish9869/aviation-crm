import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity({ name: 'privileges' })
export class Privileges {
  @PrimaryGeneratedColumn()
  privilege_id: number;

  @Column({ type: 'json', nullable: false })
  privileges: any;

  @ManyToOne(() => Roles, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: number;
}
