import { InteractionType } from '../types/interaction-type.type';

export class InteractionDto {
  userId: number;
  targetUserId: number;
  interactionType: InteractionType;
}
