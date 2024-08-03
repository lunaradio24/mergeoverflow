import { JoinColumn, ManyToOne, PrimaryColumn, Entity } from 'typeorm';
import { Interest } from './interest.entity';
import { User } from './user.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

@Entity({ name: 'user_to_interests' })
export class UserToInterest {
  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  interestId: number;

  @ManyToOne(() => User, (user) => user.userToInterests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Interest, (interest) => interest.userToInterests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'interest_id', referencedColumnName: 'id' })
  interest: Interest;
}
