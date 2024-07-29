import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  // 기술 수정
  async update(id: number, adminTechDto: AdminTechDto) {
    // 관리자 ID가 맞는지 확인
    // const userId = user.id

    // 아니라면 배출
    // if(!userId){
    //   throw new NotFoundException("허가 받지 않은 사람입니다.")
    // }

    // 기술의 기술의 ID 검색
    const findTech = await this.techRepository.findOne({
      where: { id },
    });

    // 아니라면 오류 배출
    if (!findTech) {
      throw new BadRequestException('존재하지 않는 ID입니다.');
    }

    // 맞으면 새로운 것을 업데이트
    await this.techRepository.update({ id }, adminTechDto);

    // 업데이트 한 것들 다시 조회
    const updateTech = await this.techRepository.findOne({
      where: {
        id,
      },
    });

    return updateTech;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} tech`;
  // }
}
