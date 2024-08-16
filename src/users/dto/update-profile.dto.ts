import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Frequency } from '../types/frequency.type';
import { Religion } from '../types/religion.type';
import { Mbti } from '../types/mbti.type';
import { BodyShape } from '../types/bodyshape.type';
import { Pet } from '../types/pet.type';
import { Region } from '../types/region.type';

export class UpdateProfileDto {
  @IsOptional()
  @IsEnum(Frequency)
  smokingFreq?: Frequency;

  @IsOptional()
  @IsEnum(Frequency)
  drinkingFreq?: Frequency;

  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @IsOptional()
  @IsEnum(Mbti)
  mbti?: Mbti;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsEnum(BodyShape)
  bodyShape?: BodyShape;

  @IsOptional()
  @IsEnum(Pet)
  pet?: Pet;

  @IsOptional()
  @IsEnum(Region)
  region?: Region;

  @IsOptional()
  @IsString()
  bio?: string;
}
