import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @Column({ type: 'int' })
  userId: number;

  @IsOptional()
  @IsDecimal()
  @Column('decimal', { precision: 6, scale: 4, nullable: true })
  latitude: number | null;

  @IsOptional()
  @IsDecimal()
  @Column('decimal', { precision: 7, scale: 4, nullable: true })
  longitude: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
