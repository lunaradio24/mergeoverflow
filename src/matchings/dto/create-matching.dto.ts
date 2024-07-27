import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { InteractionType } from '../types/interaction-type.type';

export class CreateMatchingDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  targetUserId: number;

  @IsOptional()
  @IsEnum(InteractionType)
  interactionType?: InteractionType;
}
