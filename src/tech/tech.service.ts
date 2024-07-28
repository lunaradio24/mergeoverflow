import { Injectable } from '@nestjs/common';
import { AdminTechDto } from './dto/adminTechDto';
import { UserToTechDto } from './dto/userToTechDto';

@Injectable()
export class TechService {
  create(adminTechDto: AdminTechDto) {
    return 'This action adds a new tech';
  }

  findAll() {
    return `This action returns all tech`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tech`;
  }

  // update(id: number, updateTechDto: UpdateTechDto) {
  //   return `This action updates a #${id} tech`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tech`;
  // }
}
