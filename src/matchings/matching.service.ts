import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Matching } from './entities/matching.entity';
import { InteractionType } from './types/interaction-type.type';
import { NUM_MATCHING_CREATION } from './constants/matching.constant';
import { ChatRoomService } from '../chat-rooms/chat-room.service';
import { NotificationGateway } from 'src/notifications/notification.gateway';
import { NotificationType } from 'src/notifications/types/notification-type.type';
import { Preferences } from '../preferences/entities/preferences.entity';
import { PreferredGender } from '../preferences/types/preferred-gender.type';
import { Gender } from '../users/types/gender.type';
import { PreferredAgeGap } from '../preferences/types/preferred-age-gap.type';
import { PreferredHeight } from '../preferences/types/preferred-height.type';
import { Heart } from '../hearts/entities/heart.entity';
import { LocationService } from '../locations/location.service';
import { PreferredDistance } from '../preferences/types/preferred-distance.type';
import { InteractionDto } from './dto/interaction.dto';
import { UserService } from 'src/users/user.service';
import { PreferredBodyShape } from 'src/preferences/types/preferred-body-shape.type';
import { PreferredFrequency } from 'src/preferences/types/preferred-frequency.type';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Matching)
    private readonly matchingRepository: Repository<Matching>,
    @InjectRepository(Preferences)
    private readonly matchingPreferencesRepository: Repository<Preferences>,
    @InjectRepository(Heart)
    private readonly heartRepository: Repository<Heart>,
    private readonly chatRoomService: ChatRoomService,
    private readonly notificationGateway: NotificationGateway,
    private readonly locationService: LocationService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  // 필터링 함수들 추가
  private applyGenderFilter(queryBuilder: any, preferences: Preferences, userGender: Gender) {
    if (preferences.gender && preferences.gender !== PreferredGender.NO_PREFERENCE) {
      if (preferences.gender === PreferredGender.ONLY_OPPOSITE) {
        const oppositeGender = userGender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
        queryBuilder.andWhere('user.gender = :gender', { gender: oppositeGender });
      } else if (preferences.gender === PreferredGender.ONLY_SAME) {
        queryBuilder.andWhere('user.gender = :gender', { gender: userGender });
      }
    }
  }

  private applyAgeGapFilter(queryBuilder: any, preferences: Preferences, userBirthDate: string) {
    if (preferences.ageGap) {
      const birthYear = new Date(userBirthDate).getFullYear();
      let minBirthYear: number;
      let maxBirthYear: number;

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
        queryBuilder.andWhere('YEAR(user.birthDate) BETWEEN :minBirthYear AND :maxBirthYear', {
          minBirthYear,
          maxBirthYear,
        });
      }
    }
  }

  private applyHeightFilter(queryBuilder: any, heightPreference: PreferredHeight) {
    const heightRanges = {
      [PreferredHeight.HEIGHT_150_160]: [150, 160],
      [PreferredHeight.HEIGHT_160_170]: [160, 170],
      [PreferredHeight.HEIGHT_170_180]: [170, 180],
      [PreferredHeight.HEIGHT_180_PLUS]: [180, Number.MAX_SAFE_INTEGER],
    };

    if (heightPreference && heightPreference !== PreferredHeight.NO_PREFERENCE) {
      const [minHeight, maxHeight] = heightRanges[heightPreference];
      queryBuilder.andWhere('user.height BETWEEN :minHeight AND :maxHeight', { minHeight, maxHeight });
    }
  }

  private applyBodyShapeFilter(queryBuilder: any, bodyShapePreference: PreferredBodyShape) {
    if (bodyShapePreference && bodyShapePreference !== PreferredBodyShape.NO_PREFERENCE) {
      queryBuilder.andWhere('user.bodyShape = :bodyShape', { bodyShape: bodyShapePreference });
    }
  }

  private applySmokingFrequencyFilter(queryBuilder: any, smokingFreqPreference: PreferredFrequency) {
    if (smokingFreqPreference && smokingFreqPreference !== PreferredFrequency.NO_PREFERENCE) {
      queryBuilder.andWhere('user.smokingFreq = :smokingFreq', { smokingFreq: smokingFreqPreference });
    }
  }

  private applyDrinkingFrequencyFilter(queryBuilder: any, drinkingFreqPreference: PreferredFrequency) {
    if (drinkingFreqPreference && drinkingFreqPreference !== PreferredFrequency.NO_PREFERENCE) {
      queryBuilder.andWhere('user.drinkingFreq = :drinkingFreq', { drinkingFreq: drinkingFreqPreference });
    }
  }

  public async createNewMatchings(userId: number): Promise<Matching[]> {
    // 사용자의 매칭 선호도 가져오기
    const preferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { images: true },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id != :userId', { userId });

    // 매칭 선호도 필터링 적용
    if (preferences) {
      // 성별 필터링
      this.applyGenderFilter(queryBuilder, preferences, user.gender);

      // 나이차이 필터링
      this.applyAgeGapFilter(queryBuilder, preferences, user.birthDate);

      // 키 필터링
      this.applyHeightFilter(queryBuilder, preferences.height);

      // 체형 필터링
      this.applyBodyShapeFilter(queryBuilder, preferences.bodyShape);

      // 흡연빈도 필터링
      this.applySmokingFrequencyFilter(queryBuilder, preferences.smokingFreq);

      // 움주빈도 필터링
      this.applyDrinkingFrequencyFilter(queryBuilder, preferences.drinkingFreq);

      // 거리 필터링
      const userLocation = await this.locationService.getLocationByUserId(userId);
      if (userLocation.latitude && userLocation.longitude && preferences.distance !== PreferredDistance.NO_PREFERENCE) {
        const distanceInKm = {
          [PreferredDistance.WITHIN_10_KM]: 10,
          [PreferredDistance.WITHIN_20_KM]: 20,
          [PreferredDistance.WITHIN_50_KM]: 50,
          [PreferredDistance.WITHIN_100_KM]: 100,
        };

        // User 엔티티와 Location 엔티티를 조인합니다.
        queryBuilder.innerJoin('user.location', 'location');

        // 거리 필터링을 SQL 쿼리 내에서 직접 처리
        queryBuilder.andWhere(
          `ST_Distance_Sphere(
          point(location.longitude, location.latitude),
          point(:userLongitude, :userLatitude))
          <= :distanceInMeters`,
          {
            userLongitude: userLocation.longitude,
            userLatitude: userLocation.latitude,
            distanceInMeters: distanceInKm[preferences.distance] * 1000, // km를 m로 변환
          },
        );
      }
    }

    // 기존 매칭된 사용자를 제외
    const existingMatchings = await this.matchingRepository.find({
      where: { userId },
    });
    const existingTargetUserIds = existingMatchings.map((matching) => matching.targetUserId);
    if (existingTargetUserIds.length > 0) {
      queryBuilder.andWhere('user.id NOT IN (:...existingTargetUserIds)', { existingTargetUserIds });
    }

    queryBuilder.orderBy('RAND()').take(NUM_MATCHING_CREATION);
    const newUsers = await queryBuilder.getMany();

    // 새로운 매칭 엔티티 생성 및 저장
    const newMatchings = newUsers.map((user) => {
      const matching = new Matching();
      matching.userId = userId;
      matching.targetUserId = user.id;
      matching.interactionType = null;
      return matching;
    });

    // targetUserId 순으로 정렬
    newMatchings.sort((a, b) => a.targetUserId - b.targetUserId);

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

      // 새로 생성할 매칭 상대가 없으면 빈 배열 반환
      if (existingMatchings.length === 0) {
        return [];
      }
    }

    // 기존 매칭된 유저들 중 interactionType이 null인 유저 조회
    const targetUserIds = existingMatchings.map((matching) => matching.targetUserId);
    const users = await this.userRepository.find({
      where: { id: In(targetUserIds) },
      relations: ['images'],
      order: { id: 'ASC' },
    });

    return users;
  }

  async handleUserInteraction(interactionDto: InteractionDto): Promise<void> {
    const { userId, targetUserId, interactionType } = interactionDto;

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 자기 자신을 좋아요 또는 싫어요 하는지 검증
      if (userId === targetUserId) {
        throw new BadRequestException('자신을 좋아요 또는 싫어요할 수 없습니다.');
      }

      // userId와 targetUserId가 존재하는지 확인
      await this.userService.validateUserExists(userId);
      await this.userService.validateUserExists(targetUserId);

      // 하트 차감 로직 추가
      if (interactionType === InteractionType.LIKE) {
        const userHearts = await queryRunner.manager.findOne(Heart, { where: { userId } });
        if (userHearts.remainHearts <= 0) {
          throw new BadRequestException('남은 하트가 없습니다.');
        }
        await queryRunner.manager.decrement(Heart, { userId }, 'remainHearts', 1);
      }

      // 순차적으로 처리되었는지 확인
      let existingMatchings = await queryRunner.manager.find(Matching, {
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
      await queryRunner.manager.update(Matching, { userId, targetUserId }, { interactionType });
      // 상대방이 이미 좋아요를 눌렀는지 확인
      const targetUserMatching = await queryRunner.manager.findOne(Matching, {
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

        await this.chatRoomService.createChatRoom(user1Id, user2Id);
        this.notificationGateway.server
          .to(user1Id.toString())
          .emit('mergeNotify', { type: NotificationType.MERGED, userId: user1Id, targetUserId: user2Id });

        this.notificationGateway.server
          .to(user2Id.toString())
          .emit('mergeNotify', { type: NotificationType.MERGED, userId: user2Id, targetUserId: user1Id });
      }
      // 좋아요 알람을 상대방에게 보냄
      this.notificationGateway.server
        .to(targetUserId.toString())
        .emit('likeNotify', { type: NotificationType.LIKE, userId: targetUserId, mergeRequesterId: userId });
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error('Transaction failed:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAllMatchingsForUser(userId: number): Promise<void> {
    await this.matchingRepository.delete({ userId });
  }

  async likeUser(userId: number, targetUserId: number) {
    const heart = await this.heartRepository.findOne({ where: { userId } });

    if (!heart) {
      throw new NotFoundException('Heart record not found.');
    }

    if (heart.remainHearts < 1) {
      throw new ForbiddenException('남은 하트가 없습니다.');
    }

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 매칭 interaction 상태 변경 적용
      const interactionDto = { userId, targetUserId, interactionType: InteractionType.LIKE };
      await this.handleUserInteraction(interactionDto);

      // 하트 차감
      await queryRunner.manager.decrement(Heart, { userId }, 'remainHearts', 1);
    } catch (error) {
      console.error('Transaction failed:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async dislikeUser(userId: number, targetUserId: number) {
    const interactionDto = { userId, targetUserId, interactionType: InteractionType.DISLIKE };
    await this.handleUserInteraction(interactionDto);
  }
}
