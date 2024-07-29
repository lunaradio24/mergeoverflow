import { PickType } from '@nestjs/swagger';
import { Tech } from '../entities/tech.entity';

export class AdminTechDto extends PickType(Tech, ['techName']) {}
