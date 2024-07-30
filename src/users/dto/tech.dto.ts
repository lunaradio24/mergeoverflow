import { PickType } from '@nestjs/swagger';
import { Tech } from '../entities/tech.entity';

export class CreateTechDto extends PickType(Tech, ['techName']) {}
