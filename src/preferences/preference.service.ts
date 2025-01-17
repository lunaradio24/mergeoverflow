import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Preferences } from '../preferences/entities/preferences.entity';
import { UpdatePreferenceDto } from '../preferences/dto/update-preference.dto';
import { MatchingService } from 'src/matchings/matching.service';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preferences)
    private readonly preferenceRepository: Repository<Preferences>,
    private readonly matchingService: MatchingService,
    private readonly dataSource: DataSource,
  ) {}

  async get(userId: number): Promise<Preferences> {
    return await this.preferenceRepository.findOne({ where: { userId } });
  }

  async update(userId: number, updatePreferenceDto: UpdatePreferenceDto): Promise<void> {
    const preferences = await this.preferenceRepository.findOne({ where: { userId } });
    if (!preferences) {
      throw new NotFoundException(`사용자 ID ${userId}의 매칭 선호도를 찾을 수 없습니다.`);
    }

    // 매칭 선호도 업데이트
    this.preferenceRepository.merge(preferences, updatePreferenceDto);
    await this.preferenceRepository.save(preferences);

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 기존 매칭 삭제
      await this.matchingService.deleteAllMatchingsForUser(userId);

      // 새로운 매칭 생성
      await this.matchingService.createNewMatchings(userId);

      return;
    } catch (error) {
      console.error('Transaction failed:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
