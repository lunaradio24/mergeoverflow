import { Req, Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { TechService } from './tech.service';
import { CreateTechDto } from 'src/users/dto/tech.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/types/role.type';
import { Roles } from 'src/utils/decorators/roles.decorator';

@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Post()
  async create(@Body() createTechDto: CreateTechDto) {
    const data = await this.techService.create(createTechDto);
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: number, @Body() createTechDto: CreateTechDto) {
    const data = await this.techService.update(req.user, id, createTechDto); // req.user

    return {
      statusCode: HttpStatus.OK,
      message: '기술 수정이 완료되었습니다.',
      data,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.techService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: '기술 삭제가 완료되었습니다.',
    };
  }
}
