import { IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from 'src/auth/constants/auth.constant';
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
  @MinLength(MIN_PASSWORD_LENGTH, { message: AUTH_MESSAGES.COMMON.PASSWORD.MIN_LENGTH })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: AUTH_MESSAGES.COMMON.PASSWORD.MAX_LENGTH })
  @Column({ select: false })
  newPassword: string;

  @IsNotEmpty({ message: '새로운 비밀번호 확인을 입력해주세요.' })
  @IsString()
  @Column({ select: false })
  @Validate(IsMatchingConstraint, ['newPassword'])
  newPasswordConfirm: string;
}
