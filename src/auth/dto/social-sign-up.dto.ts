import { OmitType } from '@nestjs/swagger';
import { LocalSignUpDto } from './local-sign-up.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialSignUpDto extends OmitType(LocalSignUpDto, ['phoneNum', 'password', 'passwordConfirm']) {}
