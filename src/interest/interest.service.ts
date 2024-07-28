import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminInterestDto } from './dto/adminInterest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entities/Interest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InterestService {
  @InjectRepository(Interest)
  private readonly adminInterestRepository: Repository<Interest>;

  // 관심사 DB 등록
  async create(adminInterestDto: AdminInterestDto) {
    // user: any,
    // // 1. 내가 관리자인지 확인
    // const userId = user.id;

    // // 2. 관리자가 아니라면 권한 없음으로 에러 발생
    // const checkedAdmin = await this.interestRepository.findOne({
    //   where: { id: userId },
    // });

    // if (!checkedAdmin) {
    //   throw new NotFoundException('허가 받지 않은 사용자입니다.');
    // }

    // 3. DTO에서 입력 받은 데이터 입력
    try {
      const createdInterest = await this.adminInterestRepository.save(adminInterestDto);

      return createdInterest;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('중복된 관심사가 있습니다.');
      }
      throw new Error('관심사를 저장하는 중에 오류가 발생했습니다.');
    }
  }

  findAll() {
    return `This action returns all interest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interest`;
  }

  // update(id: number, updateInterestDto: UpdateInterestDto) {
  //   return `This action updates a #${id} interest`;
  // }

  remove(id: number) {
    return `This action removes a #${id} interest`;
  }
}
