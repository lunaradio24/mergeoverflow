import { Column, OneToMany, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { UserToInterest } from '../../users/entities/user-to-interest.entity';
import { IsNotEmpty, IsString } from 'class-validator';

// 관리자가 생성
@Entity({ name: 'admin_Interests' })
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '관심사를 입력해주세요.' })
  @IsString()
  @Column({ unique: true })
  interestName: string;

  @OneToMany(() => UserToInterest, (userToInterest) => userToInterest.interest)
  userToInterests: UserToInterest[];
}
