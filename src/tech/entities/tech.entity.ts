import { IsNotEmpty, IsString } from 'class-validator';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// 관리자가 기술이름  생성
@Entity({ name: 'admin_Techs' })
export class Tech {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '기술을 입력해주세요.' })
  @IsString()
  @Column({ unique: true })
  techName: string;

  // 이거 걱정하지 말 것 이것은 유저 기술 스택에 연결되는 것
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
}
