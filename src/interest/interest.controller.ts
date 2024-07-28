import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { AdminInterestDto } from './dto/adminInterest.dto';
// import { UpdateInterestDto } from './dto/update-interest.dto';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @UseGuards() // 관리자만
  @Post()
  async create(@Body() adminInterestDto: AdminInterestDto) {
    // @Req() req: any,
    const data = await this.interestService.create(adminInterestDto);

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

  @UseGuards() // 관리자만
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() adminInterestDto: AdminInterestDto) {
    // @Req() req: any,
    const data = await this.interestService.update(id, adminInterestDto);
    return {
      statusCode: HttpStatus.OK,
      message: '관심사 수정에 성공했습니다.',
      data,
    };
  }

  @UseGuards() // 관리자만
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // @Req() req: any,
    await this.interestService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: '관심사 삭제에 성공했습니다.',
    };
  }
}
