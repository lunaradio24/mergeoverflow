import { Controller, Get, Post, Body, Patch, UseGuards, BadRequestException, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PreferenceService } from './preference.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AccessTokenGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

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
