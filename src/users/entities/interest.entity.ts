import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToInterest } from './user-to-interest.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  interestName: string;

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.interest)
  userToInterests: UserToInterest[];
}
