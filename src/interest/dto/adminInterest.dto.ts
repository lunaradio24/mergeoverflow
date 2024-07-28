import { PickType } from '@nestjs/swagger';
import { Interest } from '../entities/Interest.entity';

// 이거는 관리자가 등록할 때
export class AdminInterestDto extends PickType(Interest, ['interestName']) {}
