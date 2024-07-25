import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Interest } from './interest.entity';
import { User } from './user.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserToInterest {
  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  interestId: number;

  @ManyToOne(() => User, (user) => user.userToInterests)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Interest, (interest) => interest.userToInterests)
  @JoinColumn({ name: 'interest_id', referencedColumnName: 'id' })
  interest: Interest;
}
