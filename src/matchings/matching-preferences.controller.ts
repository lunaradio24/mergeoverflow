import { Controller, Get, Post, Body, Query, ParseIntPipe, Patch, BadRequestException } from '@nestjs/common';
import { MatchingPreferencesService } from './matching-preferences.service';
import { CreateMatchingPreferencesDto } from './dto/create-matching-preferences.dto';
import { UpdateMatchingPreferencesDto } from './dto/update-matching-preferences.dto';

// @UseGuards(AccessTokenGuard)
@Controller('matching-preferences')
export class MatchingPreferencesController {
  constructor(private readonly matchingPreferencesService: MatchingPreferencesService) {}

  // 매칭 선호도 설정
  @Post()
  async createPreferences(
    @Body('userId', ParseIntPipe) userId: number,
    @Body() createMatchingPreferencesDto: CreateMatchingPreferencesDto,
  ) {
    try {
      return await this.matchingPreferencesService.createPreferences(userId, createMatchingPreferencesDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { message: '이미 매칭 선호도를 설정하셨습니다.' };
      }
      throw error;
    }
  }

  // 특정 유저의 매칭 선호도 조회
  @Get()
  async getPreferences(@Query('userId', ParseIntPipe) userId: number) {
    return this.matchingPreferencesService.getPreferences(userId);
  }

  // 매칭 선호도 수정
  @Patch()
  async updatePreferences(
    @Body('userId', ParseIntPipe) userId: number,
    @Body() updateMatchingPreferencesDto: UpdateMatchingPreferencesDto,
  ) {
    return this.matchingPreferencesService.updatePreferences(userId, updateMatchingPreferencesDto);
  }
}
