import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { InterestDto } from './dto/interest.dto';
import { INTEREST_MESSAGES } from './constants/interest.message.constant';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';
import { InterestRO } from './ro/interest.ro';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(UserToInterest)
    private readonly userToInterestRepository: Repository<UserToInterest>,
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}

  // 관심사 목록 생성
  async create(interestDto: InterestDto): Promise<boolean> {
    // 이미 존재하는 관심사 이름인지 확인
    await this.checkDuplicateInterestName(interestDto.interestName);

    // 입력한 interest 저장
    await this.interestRepository.save(interestDto);
    return true;
  }

  // 관심사 ID로 조회
  async findOneById(id: number): Promise<Interest> {
    const interest = await this.interestRepository.findOne({ where: { id } });
    if (!interest) {
      throw new NotFoundException(INTEREST_MESSAGES.READ_ONE.FAILURE.NOT_FOUND);
    }
    return interest;
  }

  // 관심사 전체 목록 조회
  async findAll(): Promise<Interest[]> {
    const interestList = await this.interestRepository.find({ order: { id: 'ASC' } });
    return interestList;
  }

  // 유저 관심사 목록 조회
  async findUserInterests(userId: number): Promise<InterestRO[]> {
    const userToInterests = await this.userToInterestRepository.find({
      where: { userId },
      relations: { interest: true },
    });

    const userInterests = userToInterests.map((userToInterest) => {
      return {
        interestId: userToInterest.interest.id,
        interestName: userToInterest.interest.interestName,
      };
    });

    return userInterests;
  }

  // 관심사 수정
  async update(id: number, interestDto: InterestDto): Promise<boolean> {
    // 존재하는 관심사 ID인지 확인
    await this.findOneById(id);

    // 이미 존재하는 관심사 이름인지 확인
    await this.checkDuplicateInterestName(interestDto.interestName);

    // 관심사 이름 업데이트
    await this.interestRepository.update({ id }, interestDto);

    return true;
  }

  // 관심사 삭제
  async remove(id: number): Promise<boolean> {
    // 존재하는 관심사 ID인지 확인
    await this.findOneById(id);

    // 관심사 삭제
    await this.interestRepository.delete(id);

    return true;
  }

  // 이미 존재하는 관심사인지 확인
  async checkDuplicateInterestName(interestName: string): Promise<void> {
    const existingInterest = await this.interestRepository.findOne({ where: { interestName } });
    if (existingInterest) {
      throw new ConflictException(INTEREST_MESSAGES.COMMON.DUPLICATE);
    }
    return;
  }
}
