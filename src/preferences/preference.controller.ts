import { Controller, Get, Post, Body, Patch, UseGuards, BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PreferenceService } from './preference.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AccessTokenGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  // 매칭 선호도 설정
  @Post()
  async create(@UserInfo() user: User, @Body() createPreferenceDto: CreatePreferenceDto) {
    const userId = user.id;

    // 이미 설정된 매칭 선호도 확인
    const existingPreferences = await this.preferenceService.get(userId);
    if (existingPreferences) {
      throw new BadRequestException('매칭 선호도를 이미 설정하셨습니다.');
    }

    // 새로운 매칭 선호도 설정
    await this.preferenceService.create(userId, createPreferenceDto);
    return {
      statusCode: HttpStatus.OK,
      message: '매칭 선호도가 성공적으로 설정되었습니다.',
    };
  }

  // 특정 유저의 매칭 선호도 조회
  @Get()
  async get(@UserInfo() user: User) {
    const userId = user.id;
    return this.preferenceService.get(userId);
  }

  // 매칭 선호도 수정
  @Patch()
  async update(@UserInfo() user: User, @Body() updatePreferenceDto: UpdatePreferenceDto) {
    const userId = user.id;
    return this.preferenceService.update(userId, updatePreferenceDto);
  }
}
