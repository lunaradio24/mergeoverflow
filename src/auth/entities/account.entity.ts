import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Role } from '../types/role.type';
import { User } from '../../users/entities/user.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  password: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  phoneNum: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.account)
  user: User;
}
