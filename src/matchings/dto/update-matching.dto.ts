import { PartialType } from '@nestjs/swagger';
import { CreateMatchingDto } from './create-matching.dto';

export class UpdateMatchingDto extends PartialType(CreateMatchingDto) {}
