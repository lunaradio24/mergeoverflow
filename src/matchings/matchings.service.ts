import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Matching } from './entities/matching.entity';
import { InteractionType } from './types/interaction-type.type';
import { bringSomeOne } from '../matchings/constants/constants';
import { ChatRoomsService } from '../chat-rooms/chat-rooms.service';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
    private readonly chatRoomsService: ChatRoomsService,
  ) {}

  // 새로운 매칭 상대를 생성하는 메서드
  private async createNewMatchings(userId: number): Promise<Matching[]> {
    // 이미 매칭된 유저 제외
    const matchedUserIds = (await this.matchingRepository.find({ where: { userId } })).map((m) => m.targetUserId);
    const newUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...ids)', { ids: [userId, ...matchedUserIds] }) // 자신과 이미 매칭된 유저 제외
      .orderBy('RAND()') // 무작위로 정렬
      .take(bringSomeOne) // 상수 사용하여 한 번에 가져올 유저 수 설정
      .getMany();

    // 새로운 매칭 엔티티 생성 및 저장
    let newMatchings = newUsers.map((user) => {
      const matching = new Matching();
      matching.userId = userId;
      matching.targetUserId = user.id;
      matching.interactionType = null;
      return matching;
    });

    // targetUserId 순으로 정렬
    newMatchings = newMatchings.sort((a, b) => a.targetUserId - b.targetUserId);

    // 새로운 매칭이 있으면 매칭레파지토리에 세이브
    if (newMatchings.length > 0) {
      await this.matchingRepository.save(newMatchings);
    }

    return newMatchings;
  }

  // 매칭된 유저들을 조회
  async getMatchingUsers(userId: number): Promise<User[]> {
    // interactionType이 null인 매칭 엔티티를 조회
    let existingMatchings = await this.matchingRepository.find({
      where: {
        userId,
        interactionType: IsNull(),
      },
      order: { createdAt: 'ASC' }, // 생성된 순서대로 정렬
    });

    if (existingMatchings.length === 0) {
      existingMatchings = await this.createNewMatchings(userId);

      // 새로운 매칭 상대가 없으면 빈 배열 반환
      if (existingMatchings.length === 0) {
        return [];
      }
    }

    // 기존 매칭된 유저들 중 interactionType이 null인 유저 조회
    const targetUserIds = existingMatchings.map((matching) => matching.targetUserId);
    const users = await this.userRepository.find({
      where: {
        id: In(targetUserIds),
      },
      relations: ['images'],
      order: { id: 'ASC' },
    });

    return users;
  }

  // 매칭 결과를 저장하는 함수
  async saveMatchingResult(userId: number, targetUserId: number, interactionType: InteractionType) {
    // 자기 자신을 좋아요 또는 싫어요 하는지 검증
    if (userId === targetUserId) {
      throw new BadRequestException('자신을 좋아요 또는 싫어요할 수 없습니다.');
    }

    // userId와 targetUserId가 존재하는지 확인
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`대상 사용자 ID ${targetUserId}를 찾을 수 없습니다.`);
    }

    // 순차적으로 처리되었는지 확인
    let existingMatchings = await this.matchingRepository.find({
      where: {
        userId,
        interactionType: IsNull(), // interaction 타입이 null인 매칭을 가져옴
      },
      order: { createdAt: 'ASC' }, // 생성된 순서대로 정렬
    });

    if (existingMatchings.length === 0) {
      // interaction 타입이 null인 매칭이 0이면 새로운 생성 메소드로 다시 가져옴
      existingMatchings = await this.createNewMatchings(userId);
    }

    if (existingMatchings.length > 0) {
      // interaction 타입이 null인 가장 첫 번째 매칭의 targetUserId 가져오기
      const nextTargetUserId = existingMatchings[0].targetUserId;

      // 상호작용해야 하는 대상 사용자 ID와 다른 경우 에러 메시지 출력
      if (nextTargetUserId !== targetUserId) {
        throw new BadRequestException('제공된 순서대로 사용자와 상호작용하세요.');
      }
    }

    // // 매칭 정보 업데이트
    await this.matchingRepository.update({ userId, targetUserId }, { interactionType });

    // 상대방이 이미 좋아요를 눌렀는지 확인
    const targetUserMatching = await this.matchingRepository.findOne({
      where: {
        userId: targetUserId,
        targetUserId: userId,
        interactionType: InteractionType.LIKE,
      },
    });
    // 서로 좋아요를 눌렀다면 채팅방 생성
    if (interactionType === InteractionType.LIKE && targetUserMatching) {
      const user1Id = targetUserMatching ? targetUserId : userId;
      const user2Id = targetUserMatching ? userId : targetUserId;
      await this.chatRoomsService.createChatRoom(user1Id, user2Id);
    }
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
