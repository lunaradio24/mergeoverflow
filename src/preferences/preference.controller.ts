import { Controller, Get, Body, Patch, UseGuards, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PreferenceService } from './preference.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { Preferences } from './entities/preferences.entity';

@UseGuards(AccessTokenGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Get()
  async get(@UserInfo() user: User): Promise<ApiResponse<Preferences>> {
    const userId = user.id;
    const preferences = await this.preferenceService.get(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '매칭 선호도 조회를 완료했습니다.',
      data: preferences,
    };
  }

  @Patch()
  async update(
    @UserInfo() user: User,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<ApiResponse<boolean>> {
    const userId = user.id;
    await this.preferenceService.update(userId, updatePreferenceDto);
    return {
      statusCode: HttpStatus.OK,
      message: '매칭 선호도 수정을 완료했습니다.',
      data: true,
    };
  }
}
