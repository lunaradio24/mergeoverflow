import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateDetailUserDto } from './dto/create-detail.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입 변경 불가 정보
  @Post('me')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return data;
  }

  /**
   * 프로필 상세 작성
   * @param createDetailUserDto
   * @returns
   */
  // @Post('me/detail')
  // async createInterest(@Body() createDetailUserDto: CreateDetailUserDto) {
  //   const data = await this.usersService.createDetailUser(createDetailUserDto);

  //   return data;
  // }

  // @Post('me/interests')
  // async createDetailUser(@Body() createDetailUserDto: CreateDetailUserDto) {
  //   const data = await this.usersService.createDetailUser(createDetailUserDto);

  //   return data;
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
