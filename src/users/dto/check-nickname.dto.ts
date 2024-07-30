import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CheckNicknameDto extends PickType(User, ['nickname']) {}
