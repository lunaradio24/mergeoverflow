import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PreferredGender } from '../types/preferred-gender.type';
import { PreferredBodyShape } from '../types/preferred-body-shape.type';
import { PreferredFrequency } from '../types/preferred-frequency.type';
import { PreferredAgeGap } from '../types/preferred-age-gap.type';
import { PreferredCodingLevel } from '../types/preferred-coding-level.type';
import { PreferredHeight } from '../types/preferred-height.type';
import { PreferredDistance } from '../types/preferred-distance.type';

@Entity({ name: 'preferences' })
export class Preferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'enum', enum: PreferredCodingLevel, nullable: true })
  codingLevel: PreferredCodingLevel;

  @Column({ type: 'enum', enum: PreferredGender, nullable: true })
  gender: PreferredGender;

  @Column({ type: 'enum', enum: PreferredAgeGap, nullable: true })
  ageGap: PreferredAgeGap;

  @Column({ type: 'enum', enum: PreferredHeight, nullable: true })
  height: PreferredHeight;

  @Column({ type: 'enum', enum: PreferredBodyShape, nullable: true })
  bodyShape: PreferredBodyShape;

  @Column({ type: 'enum', enum: PreferredFrequency, nullable: true })
  smokingFreq: PreferredFrequency;

  @Column({ type: 'enum', enum: PreferredFrequency, nullable: true })
  drinkingFreq: PreferredFrequency;

  @Column({ type: 'enum', enum: PreferredDistance, nullable: true })
  distance: PreferredDistance;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
