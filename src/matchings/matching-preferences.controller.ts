import { Controller, Get, Post, Body, Patch, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { MatchingPreferencesService } from './matching-preferences.service';
import { CreateMatchingPreferencesDto } from './dto/create-matching-preferences.dto';
import { UpdateMatchingPreferencesDto } from './dto/update-matching-preferences.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('matching-preferences')
export class MatchingPreferencesController {
  constructor(private readonly matchingPreferencesService: MatchingPreferencesService) {}

  // 매칭 선호도 설정
  @Post()
  async createPreferences(@Req() req: Request, @Body() createMatchingPreferencesDto: CreateMatchingPreferencesDto) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기

    // 이미 설정된 매칭 선호도 확인
    const existingPreferences = await this.matchingPreferencesService.getPreferences(userId);
    if (existingPreferences) {
      throw new BadRequestException('매칭 선호도를 이미 설정하셨습니다.');
    }

    // 새로운 매칭 선호도 설정
    await this.matchingPreferencesService.createPreferences(userId, createMatchingPreferencesDto);
    return { message: '매칭 선호도가 성공적으로 설정되었습니다.' };
  }

  // 특정 유저의 매칭 선호도 조회
  @Get()
  async getPreferences(@Req() req: Request) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    return this.matchingPreferencesService.getPreferences(userId);
  }

  // 매칭 선호도 수정
  @Patch()
  async updatePreferences(@Req() req: Request, @Body() updateMatchingPreferencesDto: UpdateMatchingPreferencesDto) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    return this.matchingPreferencesService.updatePreferences(userId, updateMatchingPreferencesDto);
  }
}
