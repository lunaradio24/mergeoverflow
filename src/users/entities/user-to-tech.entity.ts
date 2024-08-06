import { JoinColumn, ManyToOne, PrimaryColumn, Entity } from 'typeorm';
import { Tech } from '../../techs/entities/tech.entity';
import { User } from './user.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

@Entity({ name: 'user_to_techs' })
export class UserToTech {
  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @PrimaryColumn()
  techId: number;

  @ManyToOne(() => User, (user) => user.userToTechs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Tech, (tech) => tech.userToTechs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tech_id', referencedColumnName: 'id' })
  tech: Tech;
}
