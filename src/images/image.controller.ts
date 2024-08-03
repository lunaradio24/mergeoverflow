import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // 프로필 이미지 S3에 업로드
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageToS3(@UploadedFile() file: Express.MulterS3.File) {
    const imageUrl = await this.imageService.uploadImageToS3(file);

    return {
      statusCode: HttpStatus.CREATED,
      message: '이미지 생성이 성공적으로 완료되었습니다.',
      imageUrl,
    };
  }

  // 프로필 이미지 추가
  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createImage(@Request() req: any, @UploadedFile() file: Express.MulterS3.File) {
    const userId = req.user.id;
    const savedImage = await this.imageService.createImage(userId, file);

    return {
      statusCode: HttpStatus.CREATED,
      message: '이미지 생성이 성공적으로 완료되었습니다.',
      data: { userId, imageId: savedImage.id, imageUrl: savedImage.imageUrl },
    };
  }

  // 프로필 이미지 변경
  @UseGuards(AccessTokenGuard)
  @Patch(':imageId')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Request() req: any,
    @Param('imageId') imageId: number,
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    const userId = req.user.id;
    const imageUrl = await this.imageService.updateImage(userId, imageId, file);

    return {
      statusCode: HttpStatus.OK,
      message: '이미지 변경이 성공적으로 완료되었습니다.',
      data: { userId, imageId, imageUrl },
    };
  }

  // 프로필 이미지 삭제
  @UseGuards(AccessTokenGuard)
  @Delete(':imageId')
  async deleteImage(@Request() req: any, @Param('imageId') imageId: number) {
    const userId = req.user.id;

    await this.imageService.deleteImage(userId, imageId);

    return {
      statusCode: HttpStatus.OK,
      message: '삭제가 성공적으로 완료되었습니다.',
    };
  }
}
