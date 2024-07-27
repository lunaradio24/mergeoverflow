import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { InteractionType } from '../types/interaction-type.type';

export class UpdateMatchingDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  targetUserId?: number;

  @IsOptional()
  @IsEnum(InteractionType)
  interactionType?: InteractionType;
}
