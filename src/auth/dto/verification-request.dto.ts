import { IsString, IsNotEmpty } from 'class-validator';

export class VerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  phoneNum: string;
}
