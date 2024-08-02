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
import { IsEnum, IsOptional, IsString } from 'class-validator';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  phoneNum?: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', default: 'local' })
  provider: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  providerId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  user: User;
}
