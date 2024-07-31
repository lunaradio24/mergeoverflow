import { IsString, IsNotEmpty, IsEnum, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';
import { Gender } from '../../users/types/Gender.type';
import { Region } from '../../users/types/region.type';
import { Pet } from '../../users/types/pet.type';
import { BodyShape } from '../../users/types/bodyshape.type';
import { Mbti } from '../../users/types/mbti.type';
import { Religion } from '../../users/types/religion.type';
import { Frequency } from '../../users/types/frequency.type';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  phoneNum: string;

  @IsNotEmpty()
  @IsString()
  code: string;

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
  interests: number[];

  @IsArray()
  @ArrayNotEmpty()
  techs: number[];
}
