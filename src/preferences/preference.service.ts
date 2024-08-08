import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preferences } from '../preferences/entities/preferences.entity';
import { CreatePreferenceDto } from '../preferences/dto/create-preference.dto';
import { UpdatePreferenceDto } from '../preferences/dto/update-preference.dto';
import { MatchingService } from 'src/matchings/matching.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preferences)
    private readonly preferenceRepository: Repository<Preferences>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly matchingService: MatchingService,
  ) {}

  async create(userId: number, createPreferenceDto: CreatePreferenceDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }

    const preferences = this.preferenceRepository.create({
      ...createPreferenceDto,
      user,
    });

    return this.preferenceRepository.save(preferences);
  }

  async get(userId: number) {
    return this.preferenceRepository.findOne({ where: { user: { id: userId } } });
  }

  async update(userId: number, updatePreferenceDto: UpdatePreferenceDto) {
    const preferences = await this.preferenceRepository.findOne({ where: { user: { id: userId } } });
    if (!preferences) {
      throw new NotFoundException(`사용자 ID ${userId}의 매칭 선호도를 찾을 수 없습니다.`);
    }

    // 매칭 선호도 업데이트
    this.preferenceRepository.merge(preferences, updatePreferenceDto);
    await this.preferenceRepository.save(preferences);

    // 기존 매칭 삭제
    await this.matchingService.deleteAllMatchingsForUser(userId);

    // 새로운 매칭 생성
    await this.matchingService.createNewMatchings(userId);

    return preferences;
  }
}
