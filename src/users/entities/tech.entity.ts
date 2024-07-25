import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToTech } from './user-to-tech.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'techs' })
export class Tech {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  techName: string;

  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
}
