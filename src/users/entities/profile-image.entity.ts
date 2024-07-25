import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IsInt, IsString } from 'class-validator';

@Entity({ name: 'profile_images' })
export class ProfileImage {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @Column({ type: 'int' })
  userId: number;

  @IsString()
  @Column({ type: 'varchar' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
