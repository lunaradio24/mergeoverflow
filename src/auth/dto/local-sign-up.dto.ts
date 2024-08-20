import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Validate,
  Matches,
  ArrayMaxSize,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Gender } from '../../users/types/gender.type';
import { Region } from '../../users/types/region.type';
import { Pet } from '../../users/types/pet.type';
import { BodyShape } from '../../users/types/bodyshape.type';
import { Mbti } from '../../users/types/mbti.type';
import { Religion } from '../../users/types/religion.type';
import { Frequency } from '../../users/types/frequency.type';
import { IsPasswordMatchingConstraint } from 'src/utils/decorators/password-match.decorator';
import { Type } from 'class-transformer';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../constants/auth.constant';
import { MAX_NUM_IMAGES } from 'src/images/constants/image.constant';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';

export class LocalSignUpDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.COMMON.PHONE_NUM.REQUIRED })
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: AUTH_MESSAGES.COMMON.PHONE_NUM.INVALID_FORMAT })
  phoneNum: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.COMMON.PASSWORD.REQUIRED })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, { message: AUTH_MESSAGES.COMMON.PASSWORD.MIN_LENGTH })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: AUTH_MESSAGES.COMMON.PASSWORD.MAX_LENGTH })
  password: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.COMMON.PASSWORD_CONFIRM.REQUIRED })
  @IsString()
  @Validate(IsPasswordMatchingConstraint, { message: AUTH_MESSAGES.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD })
  readonly passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEnum(Frequency)
  smokingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Frequency)
  drinkingFreq: Frequency;

  @IsNotEmpty()
  @IsEnum(Religion)
  religion: Religion;

  @IsNotEmpty()
  @IsEnum(Mbti)
  mbti: Mbti;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  height: number;

  @IsNotEmpty()
  @IsEnum(BodyShape)
  bodyShape: BodyShape;

  @IsNotEmpty()
  @IsEnum(Pet)
  pet: Pet;

  @IsNotEmpty()
  @IsEnum(Region)
  region: Region;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  interests: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  techs: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_NUM_IMAGES)
  @IsString({ each: true })
  profileImageUrls: string[];
}
