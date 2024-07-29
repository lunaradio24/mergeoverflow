import { Injectable } from '@nestjs/common';
import { AdminTechDto } from './dto/adminTechDto';
import { UserToTechDto } from './dto/userToTechDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tech } from './entities/tech.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechService {
  @InjectRepository(Tech)
  private readonly techRepository: Repository<Tech>;

  // 기술 목록 생성
  async create(adminTechDto: AdminTechDto) {
    // // 1. 내가 관리자인지 확인
    // const userId = user.id;

    // // 2. 관리자가 아니라면 권한 없음으로 에러 발생
    // const checkedAdmin = await this.interestRepository.findOne({
    //   where: { id: userId },
    // });

    // if (!checkedAdmin) {
    //   throw new NotFoundException('허가 받지 않은 사용자입니다.');
    // }

    // 입력한 tech 저장
    const saveTech = await this.techRepository.save(adminTechDto);

    return saveTech;
  }

  // 기술 목록 조회
  async findAll() {
    const findTech = await this.techRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return findTech;
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
