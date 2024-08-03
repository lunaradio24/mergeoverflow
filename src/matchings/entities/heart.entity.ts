import { IsInt, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'hearts' })
export class Heart {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  userId: number;

  @IsInt()
  @Column({ type: 'int', default: 10 })
  remainHearts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.hearts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
