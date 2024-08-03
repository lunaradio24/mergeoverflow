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
  IsOptional,
} from 'class-validator';
import { Gender } from '../../users/types/Gender.type';
import { Region } from '../../users/types/region.type';
import { Pet } from '../../users/types/pet.type';
import { BodyShape } from '../../users/types/bodyshape.type';
import { Mbti } from '../../users/types/mbti.type';
import { Religion } from '../../users/types/religion.type';
import { Frequency } from '../../users/types/frequency.type';
import { IsPasswordMatchingConstraint } from 'src/utils/decorators/password-match.decorator';
import { Type } from 'class-transformer';
import { IMAGE_LIMIT } from '../constants/auth.constants';

export class SignUpDto {
  @IsOptional()
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' })
  phoneNum?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: `비밀번호는 최소 8자리입니다.` })
  @MaxLength(16, { message: `비밀번호는 최대 16자리입니다.` })
  password?: string;

  @IsOptional()
  @IsString()
  @Validate(IsPasswordMatchingConstraint, { message: '비밀번호가 일치하지 않습니다.' })
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
  @ArrayMaxSize(IMAGE_LIMIT)
  @IsString({ each: true })
  profileImageUrls: string[];

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  providerId?: string;
}
