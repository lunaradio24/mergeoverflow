import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { TechService } from './tech.service';
import { TechDto } from './dto/tech.dto';
import { Tech } from './entities/tech.entity';
import { TECH_MESSAGES } from './constants/tech.message.constant';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/types/role.type';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { TechRO } from './ro/tech.ro';

@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() techDto: TechDto): Promise<ApiResponse<boolean>> {
    await this.techService.create(techDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: TECH_MESSAGES.CREATE.SUCCEED,
      data: true,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Tech[]>> {
    const techList = await this.techService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: TECH_MESSAGES.READ_ALL.SUCCEED,
      data: techList,
    };
  }

  // 유저 관심사 목록 조회
  @UseGuards(AccessTokenGuard)
  @Get('my')
  async findUserTechs(@UserInfo() user: User): Promise<ApiResponse<TechRO[]>> {
    const userId = user.id;
    const userTechs = await this.techService.findUserTechs(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '내 기술스택 목록 조회에 성공했습니다.',
      data: userTechs,
    };
  }

  // 유저 관심사 수정
  @UseGuards(AccessTokenGuard)
  @Put('my')
  async updateUserTechs(@UserInfo() user: User, @Body() techIds: number[]): Promise<ApiResponse<null>> {
    const userId = user.id;
    await this.techService.updateUserTechs(userId, techIds);

    return {
      statusCode: HttpStatus.OK,
      message: '내 기술스택 목록 수정에 성공했습니다.',
      data: null,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() techDto: TechDto): Promise<ApiResponse<boolean>> {
    const data = await this.techService.update(id, techDto); // req.user

    return {
      statusCode: HttpStatus.OK,
      message: TECH_MESSAGES.UPDATE.SUCCEED,
      data: true,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<boolean>> {
    await this.techService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: TECH_MESSAGES.DELETE.SUCCEED,
      data: true,
    };
  }
}
