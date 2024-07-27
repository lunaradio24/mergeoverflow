import { PickType } from '@nestjs/swagger';
import { Interest } from '../entities/interest.entity';

export class CreateInterestDto extends PickType(Interest, ['interestName']) {}
