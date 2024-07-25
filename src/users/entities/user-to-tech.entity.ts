import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Tech } from './tech.entity';
import { User } from './user.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UserToTech {
  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  techId: number;

  @ManyToOne(() => User, (user) => user.userToTechs)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Tech, (tech) => tech.userToTechs)
  @JoinColumn({ name: 'tech_id', referencedColumnName: 'id' })
  tech: Tech;
}
