import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../types/notification-type.type';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  userId: number;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  message: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'read_at' })
  readAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
