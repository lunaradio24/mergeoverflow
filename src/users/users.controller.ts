import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/auth/types/role.type';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 프로필 조회, 내 정보 조회,
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Get('me')
  async find(@Request() req: any) {
    const data = await this.usersService.find(req.user);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 조회에 성공했습니다.',
      data,
    };
  }

  // 프로필 수정
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.usersService.updateUserProfile(req.user, updateProfileDto);

    return {
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공했습니다.',
      data,
    };
  }

  // 비밀번호 수정
  @UseGuards(RolesGuard)
  @Roles(Role.USER) // 로그인한 사람만 가능하게
  @Patch('me/password')
  async updatePassword(@Req() req: any, @Body() UpdatePasswordDto: UpdatePasswordDto) {
    const data = await this.usersService.updatePassword(req.user, UpdatePasswordDto);

    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호 수정이 완료되었습니다.',
      data,
    };
  }

  // 프로필 이미지 추가
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post('me/images')
  @UseInterceptors(FileInterceptor('image'))
  async createProfileImage(@Req() req: any, @UploadedFile() file: Express.MulterS3.File) {
    console.log('req', req);
    const imageUrl = await this.usersService.createProfileImage(req.user.id, file);

    return imageUrl;
  }

  // 프로필 이미지 변경
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Patch('me/images/:imageId')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @Req() req: any,
    @Param('imageId') imageId: number,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const imageUrl = await this.usersService.updateProfileImage(req.user.id, imageId, file);

    return imageUrl;
  }

  // // 프로필 이미지 삭제
  // @UseGuards(RolesGuard)
  // @Roles(Role.USER)
  // @Post('me/images/:imageId')
  // async deleteProfileImage(@Req() req: any, @Param('imageId') imageId: number) {
  //   const deleteUrl = await this.usersService.deleteProfileImage(req.user.id, imageId);

  //   return deleteUrl;
  // }

  // 닉네임 중복 확인(이거 아마 auth에서 쓸거 같은데 왜 여기서??)
  @Post('nicknames/check-duplicate')
  async checkNickname(@Body() checkNicknameDto: CheckNicknameDto) {
    const data = await this.usersService.checkName(checkNicknameDto);

    return {
      statusCode: HttpStatus.OK,
      message: '사용 가능한 닉네임입니다.',
      data,
    };
  }
}
