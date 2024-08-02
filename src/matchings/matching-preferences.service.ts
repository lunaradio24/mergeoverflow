import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { User } from '../users/entities/user.entity';
import { CreateMatchingPreferencesDto } from './dto/create-matching-preferences.dto';
import { UpdateMatchingPreferencesDto } from './dto/update-matching-preferences.dto';

@Injectable()
export class MatchingPreferencesService {
  constructor(
    @InjectRepository(MatchingPreferences)
    private readonly matchingPreferencesRepository: Repository<MatchingPreferences>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPreferences(userId: number, createMatchingPreferencesDto: CreateMatchingPreferencesDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const existingPreferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    if (existingPreferences) {
      throw new BadRequestException('이미 매칭 선호도를 설정하셨습니다.');
    }

    const preferences = this.matchingPreferencesRepository.create({
      ...createMatchingPreferencesDto,
      user,
    });

    return this.matchingPreferencesRepository.save(preferences);
  }

  async getPreferences(userId: number): Promise<MatchingPreferences> {
    const preferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException(`매칭 선호도를 찾을 수 없습니다.`);
    }
    return preferences;
  }

  async updatePreferences(
    userId: number,
    updateMatchingPreferencesDto: UpdateMatchingPreferencesDto,
  ): Promise<MatchingPreferences> {
    const preferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException(`매칭 선호도를 찾을 수 없습니다.`);
    }

    // 직접 쿼리 조작을 피하기 위해 병합 및 저장을 사용하여 업데이트
    Object.assign(preferences, updateMatchingPreferencesDto);
    return this.matchingPreferencesRepository.save(preferences);
  }
}
