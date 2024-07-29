import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TechService } from './tech.service';
import { AdminTechDto } from './dto/adminTechDto';

@Controller('tech')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards() // 관리자만 가능
  @Post()
  async create(@Body() adminTechDto: AdminTechDto) {
    // @Req() req: any,
    const data = await this.techService.create(adminTechDto);
    // req.user
    return {
      statusCode: HttpStatus.CREATED,
      message: '기술 생성에 성공했습니다.',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.techService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: '기술 목록 조회를 성공했습니다.',
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTechDto: UpdateTechDto) {
  //   return this.techService.update(+id, updateTechDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.techService.remove(+id);
  // }
}
