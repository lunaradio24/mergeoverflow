import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToTech } from './user-to-tech.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'techs' })
export class Tech {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '기술을 입력해주세요.' })
  @IsString()
  @Column({ unique: true })
  techName: string;

  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
}
