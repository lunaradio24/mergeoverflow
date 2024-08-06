import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { CreateMatchingPreferencesDto } from './dto/create-matching-preferences.dto';
import { UpdateMatchingPreferencesDto } from './dto/update-matching-preferences.dto';
import { User } from '../users/entities/user.entity';
import { MatchingService } from './matchings.service';

@Injectable()
export class MatchingPreferencesService {
  constructor(
    @InjectRepository(MatchingPreferences)
    private readonly matchingPreferencesRepository: Repository<MatchingPreferences>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly matchingService: MatchingService,
  ) {}

  async createPreferences(userId: number, createMatchingPreferencesDto: CreateMatchingPreferencesDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const preferences = await this.matchingPreferencesRepository.create({
      ...createMatchingPreferencesDto,
      user,
    });

    return this.matchingPreferencesRepository.save(preferences);
  }

  async getPreferences(userId: number) {
    return this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
  }

  async updatePreferences(userId: number, updateMatchingPreferencesDto: UpdateMatchingPreferencesDto) {
    const preferences = await this.matchingPreferencesRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException(`사용자 ID ${userId}의 매칭 선호도를 찾을 수 없습니다.`);
    }

    // 매칭 선호도 업데이트
    this.matchingPreferencesRepository.merge(preferences, updateMatchingPreferencesDto);
    await this.matchingPreferencesRepository.save(preferences);

    // 기존 매칭 삭제
    await this.matchingService.deleteAllMatchingsForUser(userId);

    // 새로운 매칭 생성
    await this.matchingService.createNewMatchings(userId);

    return preferences;
  }
}
