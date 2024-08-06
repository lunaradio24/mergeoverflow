import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Matching } from './entities/matching.entity';
import { InteractionType } from './types/interaction-type.type';
import { BRING_SOMEONE } from './constants/matching.constants';
import { ChatRoomsService } from '../chat-rooms/chat-rooms.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationType } from 'src/notifications/types/notification-type.type';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { PreferredGender } from './types/preferred-gender.type';
import { Gender } from '../users/types/gender.type';
import { PreferredAgeGap } from './types/preferred-age-gap.type';
import { PreferredHeight } from './types/preferred-height.type';
import { Heart } from './entities/heart.entity';
import { LocationService } from '../locations/location.service';
import { PreferredDistance } from './types/preferred-distance.type';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
    @InjectRepository(MatchingPreferences)
    private readonly matchingPreferencesRepository: Repository<MatchingPreferences>,
    @InjectRepository(Heart)
    private readonly heartRepository: Repository<Heart>,
    private readonly chatRoomsService: ChatRoomsService,
    private readonly NotificationsGateway: NotificationsGateway,
    private readonly locationService: LocationService,
  ) {}

  // 새로운 매칭 상대를 생성하는 메서드
  public async createNewMatchings(userId: number): Promise<Matching[]> {
    // private에서 public으로 변경
    // 사용자의 매칭 선호도 가져오기
    const preferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id != :userId', { userId });

    // 매칭 선호도 필터링 적용
    if (preferences) {
      //성별에 선호도 필터링
      if (preferences.gender && preferences.gender !== PreferredGender.NO_PREFERENCE) {
        if (preferences.gender === PreferredGender.ONLY_OPPOSITE) {
          const oppositeGender = user.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
          queryBuilder.andWhere('user.gender = :gender', { gender: oppositeGender });
        } else if (preferences.gender === PreferredGender.ONLY_SAME) {
          queryBuilder.andWhere('user.gender = :gender', { gender: user.gender });
        }
      }

      //지역필터링
      if (preferences.region) {
        queryBuilder.andWhere('user.region = :region', { region: preferences.region });
      }

      //나이차이 필터링
      if (preferences.ageGap) {
        const birthYear = new Date(user.birthDate).getFullYear();
        let minBirthYear;
        let maxBirthYear;

        switch (preferences.ageGap) {
          case PreferredAgeGap.WITHIN_3_YEARS:
            minBirthYear = birthYear - 3;
            maxBirthYear = birthYear + 3;
            break;
          case PreferredAgeGap.WITHIN_5_YEARS:
            minBirthYear = birthYear - 5;
            maxBirthYear = birthYear + 5;
            break;
          case PreferredAgeGap.WITHIN_10_YEARS:
            minBirthYear = birthYear - 10;
            maxBirthYear = birthYear + 10;
            break;
          default:
            minBirthYear = null;
            maxBirthYear = null;
        }
        if (minBirthYear && maxBirthYear) {
          //SQL YEAR 함수 , 1991-01-01 이면 1991이라는 연도를 추출함
          queryBuilder.andWhere('YEAR(user.birthDate) BETWEEN :minBirthYear AND :maxBirthYear', {
            minBirthYear,
            maxBirthYear,
          });
        }
      }
      //키 필터링
      if (preferences.height && preferences.height !== PreferredHeight.NO_PREFERENCE) {
        switch (preferences.height) {
          case PreferredHeight.HEIGHT_150_160:
            queryBuilder.andWhere('user.height BETWEEN 150 AND 160');
            break;
          case PreferredHeight.HEIGHT_160_170:
            queryBuilder.andWhere('user.height BETWEEN 160 AND 170');
            break;
          case PreferredHeight.HEIGHT_170_180:
            queryBuilder.andWhere('user.height BETWEEN 170 AND 180');
            break;
          case PreferredHeight.HEIGHT_180_PLUS:
            queryBuilder.andWhere('user.height > 180');
            break;
        }
      }
      //체형 필터링
      if (preferences.bodyShape) {
        queryBuilder.andWhere('user.bodyShape = :bodyShape', { bodyShape: preferences.bodyShape });
      }
      //흡연빈도
      if (preferences.smokingFrequency) {
        queryBuilder.andWhere('user.smokingFreq = :smokingFreq', { smokingFreq: preferences.smokingFrequency });
      }
      //움주빈도
      if (preferences.drinkingFrequency) {
        queryBuilder.andWhere('user.drinkingFreq = :drinkingFreq', { drinkingFreq: preferences.drinkingFrequency });
      }
      //종교 필터링
      if (preferences.religion) {
        queryBuilder.andWhere('user.religion = :religion', { religion: preferences.religion });
      }
      // //코딩레벨 필터링
      // if (preferences.codingLevel) {
      //   queryBuilder.andWhere('user.codingLevel = :codingLevel', { codingLevel: preferences.codingLevel });
      // }

      // 거리 필터링
      if (preferences.distance && preferences.distance !== PreferredDistance.NO_PREFERENCE) {
        // 현재 사용자의 위치 정보 가져오기
        const userLocation = await this.locationService.getLocationByUserId(userId);

        // 거리 조건별 최대 거리 (단위: km)
        const distanceInKm = {
          [PreferredDistance.WITHIN_10_KM]: 10,
          [PreferredDistance.WITHIN_20_KM]: 20,
          [PreferredDistance.WITHIN_50_KM]: 50,
          [PreferredDistance.WITHIN_100_KM]: 100,
        };

        // 매칭 후보자 목록 가져오기
        const targetUsers = await this.userRepository.find();
        const userIdsWithinDistance = [];

        // 각 매칭 후보자의 위치 정보 가져오기 및 거리 계산
        for (const targetUser of targetUsers) {
          const targetLocation = await this.locationService.getLocationByUserId(targetUser.id);
          if (targetLocation) {
            const distance = this.locationService.calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              targetLocation.latitude,
              targetLocation.longitude,
            );

            // 거리가 설정된 조건 내에 있는 경우 매칭 대상 목록에 추가
            if (distance <= distanceInKm[preferences.distance]) {
              userIdsWithinDistance.push(targetUser.id);
            }
          }
        }

        // 거리 필터링 조건에 맞는 사용자만 쿼리 빌더에 추가
        queryBuilder.andWhere('user.id IN (:...userIds)', { userIds: userIdsWithinDistance });
      }
    }

    queryBuilder.orderBy('RAND()').take(BRING_SOMEONE);
    const newUsers = await queryBuilder.getMany();

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

    // 하트 차감 로직 추가
    if (interactionType === InteractionType.LIKE) {
      const userHearts = await this.heartRepository.findOne({ where: { userId } });
      if (!userHearts || userHearts.remainHearts < 1) {
        throw new BadRequestException('남은 하트가 없습니다.');
      }
      userHearts.remainHearts -= 1;
      await this.heartRepository.save(userHearts);
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

    // 매칭 정보 업데이트
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
      this.NotificationsGateway.server
        .to(user1Id.toString())
        .emit('mergeNotify', { type: NotificationType.MERGED, userId: user1Id, targetUserId: user2Id });

      this.NotificationsGateway.server
        .to(user2Id.toString())
        .emit('mergeNotify', { type: NotificationType.MERGED, userId: user2Id, targetUserId: user1Id });
    }
    // 좋아요 알람을 상대방에게 보냄
    this.NotificationsGateway.server
      .to(targetUserId.toString())
      .emit('likeNotify', { type: NotificationType.LIKE, userId: targetUserId, mergeRequesterId: userId });
  }

  // 모든 매칭 삭제 메서드 추가
  async deleteAllMatchingsForUser(userId: number) {
    await this.matchingRepository.delete({ userId });
  }

  // 좋아요를 처리하는 함수
  async likeUser(userId: number, targetUserId: number) {
    const heart = await this.heartRepository.findOne({ where: { userId } });

    if (!heart) {
      throw new NotFoundException('Heart record not found.');
    }

    if (heart.remainHearts < 1) {
      throw new ForbiddenException('남은 하트가 없습니다.');
    }

    await this.saveMatchingResult(userId, targetUserId, InteractionType.LIKE);

    heart.remainHearts -= 1;
    await this.heartRepository.save(heart);
  }

  // 싫어요를 처리하는 함수
  async dislikeUser(userId: number, targetUserId: number) {
    await this.saveMatchingResult(userId, targetUserId, InteractionType.DISLIKE); // 싫어요 처리
  }
}
