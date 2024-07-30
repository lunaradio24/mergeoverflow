import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { UserToInterest } from './user-to-interest.entity';
import { IsInt, IsNotEmpty } from 'class-validator';

// 회원가입할때 사용/ // 유저가 수정할 때 사용
@Entity({ name: 'interests' })
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '관심사를 선택해주세요.' })
  @IsInt()
  @Column({ unique: true })
  interest: number;

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.interest)
  userToInterests: UserToInterest[];
}
