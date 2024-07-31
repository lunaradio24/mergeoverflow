import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestDto } from 'src/users/dto/interest.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.type';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만
  @Post()
  async create(@Req() req: any, @Body() interestDto: InterestDto) {
    const data = await this.interestService.create(req.user, interestDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '관심사 생성에 성공했습니다.',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.interestService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: '관심사 목록조회에 성공했습니다.',
      data,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만
  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: number, @Body() interestDto: InterestDto) {
    const data = await this.interestService.update(req.user, id, interestDto);
    return {
      statusCode: HttpStatus.OK,
      message: '관심사 수정에 성공했습니다.',
      data,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: number) {
    await this.interestService.remove(req.user, id);

    return {
      statusCode: HttpStatus.OK,
      message: '관심사 삭제에 성공했습니다.',
    };
  }
}
