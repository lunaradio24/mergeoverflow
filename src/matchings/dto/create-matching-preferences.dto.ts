import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PreferredGender } from '../types/preferred-gender.type';
import { PreferredRegion } from '../types/preferred-region.type';
import { PreferredBodyShape } from '../types/preferred-body-shape.type';
import { PreferredReligion } from '../types/preferred-religion.type';
import { PreferredFrequency } from '../types/preferred-frequency.type';
import { PreferredAgeGap } from '../types/preferred-age-gap.type';
import { PreferredCodingLevel } from '../types/preferred-coding-level.type';
import { PreferredHeight } from '../types/preferred-height.type';

export class CreateMatchingPreferencesDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(PreferredGender)
  gender?: PreferredGender;

  @IsOptional()
  @IsEnum(PreferredRegion)
  region?: PreferredRegion;

  @IsOptional()
  @IsEnum(PreferredAgeGap, {
    message: 'ageGap은 3살이내, 5살이내, 10살이내, 상관없음 중에 선택해주세요',
  })
  ageGap?: PreferredAgeGap;

  @IsOptional()
  @IsEnum(PreferredHeight)
  height?: PreferredHeight;

  @IsOptional()
  @IsEnum(PreferredBodyShape)
  bodyShape?: PreferredBodyShape;

  @IsOptional()
  @IsEnum(PreferredFrequency)
  smokingFrequency?: PreferredFrequency;

  @IsOptional()
  @IsEnum(PreferredFrequency)
  drinkingFrequency?: PreferredFrequency;

  @IsOptional()
  @IsEnum(PreferredReligion)
  religion?: PreferredReligion;
}
