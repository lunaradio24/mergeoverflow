import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDetailUserDto } from './dto/create-detail.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 프로필 조회, 내 정보 조회,
  // 아무 것도 안 쓰는 것은 AccessToken을 통해서 누구인지 자동으로 인지
  // req.user는 Jwt 토큰에서 추출 할 것
  // @Request() req 를 왜 사용하느냐? req.user를 사용하기 위해서 사용한다. @Request() req를 안 쓰면 req.user를 못 사용함.
  @UseGuards()
  // @Get('me')
  // async find(@Request() req: any) {
  @Get(':id')
  async find(@Param('id') id: number) {
    console.log('findId', id);
    const data = await this.usersService.find(id);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 조회에 성공했습니다.',
      data,
    };
  }

  // 프로필 수정
  // Dto는 생성때와 변경 가능한 것들 만 수정 가능
  @UseGuards()
  // @Patch('me')
  // async updateProfile(@Req() req: any, @Body() createDetailUserDto: CreateDetailUserDto) {
  //   const data = await this.usersService.updateUserProfile(req.user, createDetailUserDto);
  @Patch('me/:id')
  async updateProfile(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.usersService.updateUserProfile(id, updateProfileDto);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공했습니다.',
      data,
    };
  }

  //비밀번호 수정
  @UseGuards() // 로그인한 사람만 가능하게
  @Patch('password/:id')
  async updatePassword(@Param('id') id: number, @Body() UpdatePasswordDto: UpdatePasswordDto) {
    const data = await this.usersService.updatePassword(id, UpdatePasswordDto);

    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호 수정이 완료되었습니다.',
      data,
    };
  }

  // 닉네임 중복 확인(이거 아마 auth에서 쓸거 같은데 왜 여기서??)
  @Post('checkNickname')
  async checkNickname(@Body() checkNicknameDto: CheckNicknameDto) {
    const data = await this.usersService.checkName(checkNicknameDto);

    return {
      statusCode: HttpStatus.OK,
      message: '사용 가능한 닉네임입니다.',
      data,
    };
  }
}
