import { OmitType } from '@nestjs/swagger';
import { LocalSignUpDto } from './local-sign-up.dto';

export class SocialSignUpDto extends OmitType(LocalSignUpDto, ['phoneNum', 'password', 'passwordConfirm']) {}
