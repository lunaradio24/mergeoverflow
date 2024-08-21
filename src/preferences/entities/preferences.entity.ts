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

  @Column({
    type: 'json',
    nullable: true,
  })
  techs: string[];

  @Column({ type: 'enum', enum: PreferredCodingLevel, nullable: true, default: PreferredCodingLevel.NO_PREFERENCE })
  codingLevel: PreferredCodingLevel;

  @Column({ type: 'enum', enum: PreferredGender, nullable: true, default: PreferredGender.NO_PREFERENCE })
  gender: PreferredGender;

  @Column({ type: 'enum', enum: PreferredAgeGap, nullable: true, default: PreferredAgeGap.NO_PREFERENCE })
  ageGap: PreferredAgeGap;

  @Column({ type: 'enum', enum: PreferredHeight, nullable: true, default: PreferredHeight.NO_PREFERENCE })
  height: PreferredHeight;

  @Column({ type: 'enum', enum: PreferredBodyShape, nullable: true, default: PreferredBodyShape.NO_PREFERENCE })
  bodyShape: PreferredBodyShape;

  @Column({ type: 'enum', enum: PreferredFrequency, nullable: true, default: PreferredFrequency.NO_PREFERENCE })
  smokingFreq: PreferredFrequency;

  @Column({ type: 'enum', enum: PreferredFrequency, nullable: true, default: PreferredFrequency.NO_PREFERENCE })
  drinkingFreq: PreferredFrequency;

  @Column({ type: 'enum', enum: PreferredDistance, nullable: true, default: PreferredDistance.NO_PREFERENCE })
  distance: PreferredDistance;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
