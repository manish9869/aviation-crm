import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from './roles.entity';
import { UserType } from './user-type.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @ManyToOne(() => Roles, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: number;

  @ManyToOne(() => UserType, { eager: true })
  @JoinColumn({ name: 'user_type_id' })
  user_type: number;

  @Column({ length: 45, nullable: false })
  firstname: string;

  @Column({ length: 45, nullable: false })
  lastname: string;

  @Column({ length: 60, nullable: false, unique: true })
  email: string;

  @Column({ length: 45, nullable: false })
  password: string;

  @Column({ length: 150, nullable: true })
  profile_pic: string;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  date_time_insert: Date;

  @Column({ default: 1 })
  enable: number;
}
