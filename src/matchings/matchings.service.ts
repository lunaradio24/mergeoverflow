import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Matching } from './entities/matching.entity';
import { InteractionType } from './types/interaction-type.type';
import { bringSomeOne } from '../matchings/constants/constants';

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
    // interactionType이 null인 매칭 엔티티를 조회
    const existingMatchings = await this.matchingRepository.find({
      where: {
        userId,
        interactionType: IsNull(),
      },
    });

    if (existingMatchings.length === 0) {
      // 새로운 매칭을 위해 무작위로 10명의 유저를 가져옴 (이미 매칭된 유저 제외)
      const matchedUserIds = (await this.matchingRepository.find({ where: { userId } })).map((m) => m.targetUserId);
      const newUsers = await this.userRepository.find({
        where: {
          id: Not(In([userId, ...matchedUserIds])), // 자신과 이미 매칭된 유저 제외
        },
        order: { id: 'ASC' },
        take: bringSomeOne, // 상수 사용하여 한 번에 가져올 유저 수 설정
      });

      // 새로운 매칭 엔티티 생성 및 저장
      const newMatchings = newUsers.map((user) => {
        const matching = new Matching();
        matching.userId = userId;
        matching.targetUserId = user.id;
        matching.interactionType = null;
        return matching;
      });

      await this.matchingRepository.save(newMatchings);

      return newUsers;
    } else {
      // 기존 매칭된 유저들 중 interactionType이 null인 유저 조회
      const targetUserIds = existingMatchings.map((matching) => matching.targetUserId);
      const users = await this.userRepository.find({
        where: {
          id: In(targetUserIds),
        },
        relations: ['images'],
      });

      return users;
    }
  }

  // 매칭 결과를 저장하는 함수
  async saveMatchingResult(userId: number, targetUserId: number, interactionType: InteractionType) {
    // 자기 자신을 좋아요 또는 싫어요 하는지 검증
    if (userId === targetUserId) {
      throw new BadRequestException('You cannot like or dislike yourself.');
    }

    // userId와 targetUserId가 존재하는지 확인
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    // 매칭 정보 업데이트
    await this.matchingRepository.update({ userId, targetUserId }, { interactionType });
  }

  // 좋아요를 처리하는 함수
  async likeUser(userId: number, targetUserId: number) {
    await this.saveMatchingResult(userId, targetUserId, InteractionType.LIKE); // 좋아요 처리
  }

  // 싫어요를 처리하는 함수
  async dislikeUser(userId: number, targetUserId: number) {
    await this.saveMatchingResult(userId, targetUserId, InteractionType.DISLIKE); // 싫어요 처리
  }
}
