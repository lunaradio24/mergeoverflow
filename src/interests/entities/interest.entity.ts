import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { UserToInterest } from '../../users/entities/user-to-interest.entity';
import { IsNotEmpty, IsString } from 'class-validator';

// 관리자가 생성 // 회원가입할때 사용/ // 유저가 수정할 때 사용
@Entity({ name: 'interests' })
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '관심사를 선택해주세요.' })
  @IsString()
  @Column({ unique: true })
  interestName: string;

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.interest, { cascade: true })
  userToInterests: UserToInterest[];
}
