import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateDetailUserDto extends OmitType(User, [
  'accountId',
  'id',
  'createdAt',
  'updatedAt',
  'birthDate',
  'gender',
  'nickname',
] as const) {}
