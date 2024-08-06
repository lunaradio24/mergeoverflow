import { Controller, Get, Post, Body, Patch, UseGuards, Request, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 프로필 조회, 내 정보 조회,
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async find(@Request() req: any) {
    const data = await this.usersService.find(req.user);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 조회에 성공했습니다.',
      data,
    };
  }

  // 프로필 수정
  @UseGuards(AccessTokenGuard)
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.usersService.updateUserProfile(req.user, updateProfileDto);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공했습니다.',
      data,
    };
  }

  // 비밀번호 수정
  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  async updatePassword(@Req() req: any, @Body() UpdatePasswordDto: UpdatePasswordDto) {
    const data = await this.usersService.updatePassword(req.user, UpdatePasswordDto);

    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호 수정이 완료되었습니다.',
      data,
    };
  }

  // 닉네임 중복 확인(이거 아마 auth에서 쓸거 같은데 왜 여기서??)
  @Post('nicknames/check-duplicate')
  async checkNickname(@Body() checkNicknameDto: CheckNicknameDto) {
    const data = await this.usersService.checkName(checkNicknameDto);

    return {
      statusCode: HttpStatus.OK,
      message: '사용 가능한 닉네임입니다.',
      data,
    };
  }
}
