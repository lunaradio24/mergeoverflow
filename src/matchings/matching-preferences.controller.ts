import { Controller, Get, Post, Body, Patch, UseGuards, BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MatchingPreferencesService } from './matching-preferences.service';
import { CreateMatchingPreferencesDto } from './dto/create-matching-preferences.dto';
import { UpdateMatchingPreferencesDto } from './dto/update-matching-preferences.dto';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AccessTokenGuard)
@Controller('matching-preferences')
export class MatchingPreferencesController {
  constructor(private readonly matchingPreferencesService: MatchingPreferencesService) {}

  // 매칭 선호도 설정
  @Post()
  async createPreferences(@UserInfo() user: User, @Body() createMatchingPreferencesDto: CreateMatchingPreferencesDto) {
    const userId = user.id;

    // 이미 설정된 매칭 선호도 확인
    const existingPreferences = await this.matchingPreferencesService.getPreferences(userId);
    if (existingPreferences) {
      throw new BadRequestException('매칭 선호도를 이미 설정하셨습니다.');
    }

    // 새로운 매칭 선호도 설정
    await this.matchingPreferencesService.createPreferences(userId, createMatchingPreferencesDto);
    return {
      statusCode: HttpStatus.OK,
      message: '매칭 선호도가 성공적으로 설정되었습니다.',
    };
  }

  // 특정 유저의 매칭 선호도 조회
  @Get()
  async getPreferences(@UserInfo() user: User) {
    const userId = user.id;
    return this.matchingPreferencesService.getPreferences(userId);
  }

  // 매칭 선호도 수정
  @Patch()
  async updatePreferences(@UserInfo() user: User, @Body() updateMatchingPreferencesDto: UpdateMatchingPreferencesDto) {
    const userId = user.id;
    return this.matchingPreferencesService.updatePreferences(userId, updateMatchingPreferencesDto);
  }
}
