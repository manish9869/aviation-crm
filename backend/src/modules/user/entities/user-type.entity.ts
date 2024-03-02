import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'login_user_type' })
export class UserType {
  @PrimaryGeneratedColumn()
  login_user_type_id: number;

  @Column({ length: 45, nullable: false })
  user_type: string;

  @Column({ length: 100, nullable: true })
  user_type_description: string;
}
