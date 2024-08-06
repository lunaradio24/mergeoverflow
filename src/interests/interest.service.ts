import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { Repository } from 'typeorm';
import { InterestDto } from 'src/users/dto/interest.dto';
import { Account } from 'src/auth/entities/account.entity';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // 관심사 DB 등록
  async create(user: any, interestDto: InterestDto) {
    // 1. 내가 관리자인지 확인
    const userId = user.id;

    // 2. 관리자가 아니라면 권한 없음으로 에러 발생
    const checkedAdmin = await this.accountRepository.findOne({
      where: { id: userId },
    });

    if (!checkedAdmin) {
      throw new NotFoundException('허가 받지 않은 사용자입니다.');
    }

    // 3. DTO에서 입력 받은 데이터 입력
    try {
      const createdInterest = await this.interestRepository.save(interestDto);

      return createdInterest;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('중복된 관심사가 있습니다.');
      }
      throw new Error('관심사를 저장하는 중에 오류가 발생했습니다.');
    }
  }

  // 관심사 DB조회 관리자 x
  async findAll(): Promise<Interest[]> {
    const findInterest = await this.interestRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return findInterest;
  }

  // 관심사 업데이트
  async update(user: any, id: number, interestDto: InterestDto) {
    // 1. 내가 관리자인지 확인
    const userId = user.id;

    // 2. 관리자가 아니라면 권한 없음으로 에러 발생
    const checkedAdmin = await this.accountRepository.findOne({
      where: { id: userId },
    });

    if (!checkedAdmin) {
      throw new NotFoundException('허가 받지 않은 사용자입니다.');
    }

    const findInterestId = await this.interestRepository.findOne({
      where: { id: id },
    });

    if (!findInterestId) {
      throw new BadRequestException('존재하지 않는 Id입니다.');
    }

    await this.interestRepository.update({ id }, { interestName: interestDto.interestName });

    const updateInterest = await this.interestRepository.findOne({
      where: { id },
    });

    if (!updateInterest) {
      throw new NotFoundException('업데이트 후 데이터를 찾을 수 없습니다.');
    }

    updateInterest.id = undefined;

    return updateInterest;
  }

  // 관심사 삭제
  async remove(user: any, id: number) {
    // 1. 내가 관리자인지 확인
    const userId = user.id;

    // 2. 관리자가 아니라면 권한 없음으로 에러 발생
    const checkedAdmin = await this.accountRepository.findOne({
      where: { id: userId },
    });

    if (!checkedAdmin) {
      throw new NotFoundException('허가 받지 않은 사용자입니다.');
    }

    const findInterestId = await this.interestRepository.findOne({
      where: { id },
    });

    if (!findInterestId) {
      throw new BadRequestException('존재하지 않는 Id입니다.');
    }

    const deleteInterestId = await this.interestRepository.delete(id);

    return deleteInterestId;
  }
}
