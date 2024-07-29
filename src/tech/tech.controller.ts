import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TechService } from './tech.service';
import { AdminTechDto } from './dto/adminTechDto';

@Controller('tech')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards() // 관리자만 가능
  @Post()
  async create(@Body() adminTechDto: AdminTechDto) {
    // @Req() req: any,
    const data = await this.techService.create(adminTechDto); // req.user
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

  @UseGuards() // 관리자만 가능
  @Patch(':id')
  // @Req() req: any,
  async update(@Param('id', ParseIntPipe) id: number, @Body() adminTechDto: AdminTechDto) {
    const data = await this.techService.update(id, adminTechDto); // req.user

    return {
      statusCode: HttpStatus.OK,
      message: '기술 수정이 완료되었습니다.',
      data,
    };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.techService.remove(+id);
  // }
}
