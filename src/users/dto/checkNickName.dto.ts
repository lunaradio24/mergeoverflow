import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CheckNickNameDto extends PickType(User, ['nickname']) {}
