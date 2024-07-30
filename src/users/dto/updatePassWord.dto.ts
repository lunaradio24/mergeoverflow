import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Column } from 'typeorm';

export class UpdatePassWordDto {
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  // select: false를 사용하면 보안상 민감한 데이터를 조회 시 자동으로 제외할 수 있습니다.
  // 예를 들어, 비밀번호 필드는 민감한 정보이므로 기본적으로 쿼리 결과에서 제외하여 안전하게 다룰 수 있습니다.
  password: string;

  @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  // select: false를 사용하면 보안상 민감한 데이터를 조회 시 자동으로 제외할 수 있습니다.
  // 예를 들어, 비밀번호 필드는 민감한 정보이므로 기본적으로 쿼리 결과에서 제외하여 안전하게 다룰 수 있습니다.
  newPassword: string;
}
