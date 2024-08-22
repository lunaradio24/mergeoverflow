import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { AUTH_MESSAGES } from 'src/auth/constants/auth.message.constant';
import { IsMatchingConstraint } from 'src/utils/decorators/password-match.decorator';
import { Column } from 'typeorm';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  password: string;

  @IsNotEmpty({ message: '새로운 비밀번호를 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  newPassword: string;

  @IsNotEmpty({ message: '새로운 비밀번호 확인을 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  @Validate(IsMatchingConstraint, ['newPassword'])
  newPasswordConfirm: string;
}
