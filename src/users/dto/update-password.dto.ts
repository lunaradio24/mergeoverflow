import { IsNotEmpty, IsString, IsStrongPassword, Validate } from 'class-validator';
import { AUTH_MESSAGES } from 'src/auth/constants/auth.message.constant';
import { IsPasswordMatchingConstraint } from 'src/utils/decorators/password-match.decorator';
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
  @Validate(IsPasswordMatchingConstraint, { message: AUTH_MESSAGES.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD })
  newPasswordConfirm: string;
}
