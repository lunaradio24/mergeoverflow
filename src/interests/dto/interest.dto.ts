import { PickType } from '@nestjs/swagger';
import { Interest } from '../entities/interest.entity';

export class InterestDto extends PickType(Interest, ['interestName']) {}
