import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
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
  findAll() {
    return this.interestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInterestDto: UpdateInterestDto) {
  //   return this.interestService.update(+id, updateInterestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.interestService.remove(+id);
  // }
}
