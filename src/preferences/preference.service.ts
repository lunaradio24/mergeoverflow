import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preferences } from '../preferences/entities/preferences.entity';
import { UpdatePreferenceDto } from '../preferences/dto/update-preference.dto';
import { MatchingService } from 'src/matchings/matching.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(Preferences)
    private readonly preferenceRepository: Repository<Preferences>,
    private readonly matchingService: MatchingService,
    private readonly userService: UserService,
  ) {}

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
