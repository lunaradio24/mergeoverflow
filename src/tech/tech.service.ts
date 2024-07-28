import { Injectable } from '@nestjs/common';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Injectable()
export class TechService {
  create(createTechDto: CreateTechDto) {
    return 'This action adds a new tech';
  }

  findAll() {
    return `This action returns all tech`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tech`;
  }

  update(id: number, updateTechDto: UpdateTechDto) {
    return `This action updates a #${id} tech`;
  }

  remove(id: number) {
    return `This action removes a #${id} tech`;
  }
}
