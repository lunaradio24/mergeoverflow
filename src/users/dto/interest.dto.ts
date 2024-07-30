import { PickType } from '@nestjs/swagger';
import { Interest } from '../entities/interest.entity';

// 이거는 관리자가 등록할 때
export class InterestDto extends PickType(Interest, ['interest']) {}
