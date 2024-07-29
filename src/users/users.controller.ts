import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDetailUserDto } from './dto/create-detail.dto';
import { UserToInterestDto } from '../interest/dto/userToInterest.dto';

@UseGuards() // <- Jwt 토큰 필요
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 내 정보 조회 , 프로필 조회,
  // 아무 것도 안 쓰는 것은 AccessToken을 통해서 누구인지 자동으로 인지
  // req.user는 Jwt 토큰에서 추출 할 것
  // @Request() req 를 왜 사용하느냐? req.user를 사용하기 위해서 사용한다. @Request() req를 안 쓰면 req.user를 못 사용함.
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
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() createDetailUserDto: CreateDetailUserDto) {
    const data = await this.usersService.updateUserProfile(req.user, createDetailUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공했습니다.',
      data,
    };
  }

  // @Post('me/interests')
  // async createDetailUser(@Body() createDetailUserDto: CreateDetailUserDto) {
  //   const data = await this.usersService.createDetailUser(createDetailUserDto);

  //   return data;
  // }

  // // Interest 수정
  // @Post('my')
  // async createInterest(@Req() req: any, @Body() interestDto: InterestDto) {
  //   const data = await this.usersService.createUserInterest(req.user, interestDto);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: '관심사 생성에 성공했습니다.',
  //     data,
  //   };
  // }

  // // Interest 조회
  // @Get()
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
