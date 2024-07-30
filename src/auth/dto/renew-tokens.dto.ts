import { IsInt, IsString } from 'class-validator';

export class RenewTokensDto {
  @IsInt()
  userId: number;

  @IsString()
  email: string;
}
