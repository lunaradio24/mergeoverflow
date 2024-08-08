import { IsEnum, IsOptional } from 'class-validator';
import { PreferredGender } from '../types/preferred-gender.type';
import { PreferredBodyShape } from '../types/preferred-body-shape.type';
import { PreferredFrequency } from '../types/preferred-frequency.type';
import { PreferredAgeGap } from '../types/preferred-age-gap.type';
import { PreferredHeight } from '../types/preferred-height.type';
import { PreferredDistance } from '../types/preferred-distance.type';

export class UpdatePreferenceDto {
  @IsOptional()
  @IsEnum(PreferredGender)
  gender?: PreferredGender;

  @IsOptional()
  @IsEnum(PreferredAgeGap, {
    message: 'ageGap은 [3살 이내], [5살 이내], [10살 이내], [상관없음] 중에 선택해주세요',
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
  @IsEnum(PreferredDistance, {
    message: 'distance은 [10km 이내], [20km 이내], [50km 이내], [100km 이내], [상관 없음] 중에 선택해주세요',
  })
  distance?: PreferredDistance;
}
