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
import { UserToInterestDto } from '../interest/dto/userToInterest.dto';
import { UpdatePassWordDto } from './dto/updatePassWord.dto';
import { CheckNickNameDto } from './dto/checkNickName.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 프로필 조회, 내 정보 조회,
  // 아무 것도 안 쓰는 것은 AccessToken을 통해서 누구인지 자동으로 인지
  // req.user는 Jwt 토큰에서 추출 할 것
  // @Request() req 를 왜 사용하느냐? req.user를 사용하기 위해서 사용한다. @Request() req를 안 쓰면 req.user를 못 사용함.
  @UseGuards()
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
  // Dto는 생성때와 변경 가능한 것들 만 수정 가능
  @UseGuards()
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() createDetailUserDto: CreateDetailUserDto) {
    const data = await this.usersService.updateUserProfile(req.user, createDetailUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공했습니다.',
      data,
    };
  }

  // 영진님 쓰세요.
  @UseGuards()
  @Patch(':id')
  async createDetailUser(@Body() createDetailUserDto: CreateDetailUserDto) {
    const data = await this.usersService.createDetailUser(createDetailUserDto);

    return data;
  }

  //비밀번호 수정
  @UseGuards() // 로그인한 사람만 가능하게
  @Patch(':id')
  async updatePassWord(@Param('id', ParseIntPipe) id: number, @Body() updatePassWordDto: UpdatePassWordDto) {
    this.usersService.updatePassWord(id, updatePassWordDto);

    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호 수정이 완료되었습니다.',
    };
  }

  // 닉네임 중복 확인(이거 아마 auth에서 쓸거 같은데 왜 여기서??)
  @Post('checkNickName')
  async checkNickName(@Body() checkNickNameDto: CheckNickNameDto) {
    const data = await this.usersService.checkName(checkNickNameDto);

    return {
      statusCode: HttpStatus.OK,
      message: '사용 가능한 닉네임입니다.',
      data,
    };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
