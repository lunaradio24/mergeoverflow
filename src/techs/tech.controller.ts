import { Req, Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { TechService } from './tech.service';
import { CreateTechDto } from 'src/users/dto/tech.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/types/role.type';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { Tech } from './entities/tech.entity';

@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Post()
  async create(@Body() createTechDto: CreateTechDto): Promise<ApiResponse<boolean>> {
    await this.techService.create(createTechDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '기술 생성에 성공했습니다.',
      data: true,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Tech[]>> {
    const techList = await this.techService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: '기술 목록 조회를 성공했습니다.',
      data: techList,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Patch(':id')
  async update(@Param('id') id: number, @Body() createTechDto: CreateTechDto): Promise<ApiResponse<boolean>> {
    const data = await this.techService.update(id, createTechDto); // req.user

    return {
      statusCode: HttpStatus.OK,
      message: '기술 수정이 완료되었습니다.',
      data: true,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN) // 관리자만 가능
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<boolean>> {
    await this.techService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: '기술 삭제가 완료되었습니다.',
      data: true,
    };
  }
}
