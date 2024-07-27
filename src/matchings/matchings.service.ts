import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Matching } from './entities/matching.entity';
import { InteractionType } from './types/interaction-type.type';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
  ) {}

  // 매칭된 유저들을 조회
  async getMatchingUsers(userId: number) {
    // 매칭 엔티티에서 userId와 일치하는 항목을 찾고 targetUserId만 선택
    const matchings = await this.matchingRepository.find({
      where: { userId },
      select: ['targetUserId'],
    });

    // 찾은 매칭 항목에서 targetUserId 값만 추출하여 배열로 만듦
    const targetUserIds = matchings.map((matching) => matching.targetUserId);

    // targetUserIds 배열에 있는 모든 유저 조회
    const users = await this.userRepository.find({
      where: {
        id: In(targetUserIds), // TypeORM의 In을 사용하여 다수의 ID를 조건으로 설정
      },
      order: { id: 'ASC' }, // ID 오름차순으로 정렬
      select: ['id', 'nickname'],
    });

    return users;
  }

  // 매칭 결과를 저장하는 함수
  async saveMatchingResult(userId: number, targetUserId: number, isMatch: boolean) {
    // 새로운 Matching 객체 생성
    const matching = new Matching();
    matching.userId = userId;
    matching.targetUserId = targetUserId;
    matching.interactionType = isMatch ? InteractionType.LIKE : InteractionType.DISLIKE;
    // 매칭 정보 저장
    await this.matchingRepository.save(matching);
  }
}
