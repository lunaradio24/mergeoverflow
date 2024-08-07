import { PickType } from '@nestjs/swagger';
import { Tech } from '../entities/tech.entity';

export class TechDto extends PickType(Tech, ['techName']) {}
