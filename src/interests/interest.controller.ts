import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { InterestService } from './interest.service';
import { InterestDto } from './dto/interest.dto';
import { Interest } from './entities/interest.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.type';
import { INTEREST_MESSAGES } from './constants/interest.message.constant';

@Controller('interests')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  // 관심사 등록
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() interestDto: InterestDto): Promise<ApiResponse<boolean>> {
    await this.interestService.create(interestDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: INTEREST_MESSAGES.CREATE.SUCCEED,
      data: true,
    };
  }

  // 관심사 전체 목록 조회
  @Get()
  async findAll(): Promise<ApiResponse<Interest[]>> {
    const interestList = await this.interestService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: INTEREST_MESSAGES.READ_ALL.SUCCEED,
      data: interestList,
    };
  }

  // 관심사 수정
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() interestDto: InterestDto): Promise<ApiResponse<boolean>> {
    await this.interestService.update(id, interestDto);
    return {
      statusCode: HttpStatus.OK,
      message: INTEREST_MESSAGES.UPDATE.SUCCEED,
      data: true,
    };
  }

  // 관심사 삭제
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<boolean>> {
    await this.interestService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: INTEREST_MESSAGES.DELETE.SUCCEED,
      data: true,
    };
  }
}
