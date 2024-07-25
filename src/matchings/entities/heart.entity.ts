import { IsInt, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @OneToOne(() => User, (user) => user.hearts)
  user: User;
}
