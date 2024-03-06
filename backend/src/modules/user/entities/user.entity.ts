import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from './roles.entity';
import { UserType } from './user-type.entity';
import { Seller } from './seller.entity';
import { Privileges } from './privileges.entity';

@Entity({ name: 'login_user' })
export class User {
  @PrimaryGeneratedColumn()
  login_user_id: number;

  @ManyToOne(() => Roles, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: number;

  @ManyToOne(() => UserType, { eager: true })
  @JoinColumn({ name: 'login_user_type_id' })
  user_type: number;

  @ManyToOne(() => Seller, { eager: true })
  @JoinColumn({ name: 'seller_id' })
  seller: number;

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
