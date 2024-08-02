import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  Param,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Express } from 'express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUrl = await this.s3Service.imageUploadToS3(fileName, file);
    return { fileUrl };
  }

  @Delete('delete')
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('파일 URL이 필요합니다.');
    }

    await this.s3Service.deleteFileFromS3(fileUrl);
    return { message: '파일 삭제 성공' };
  }
}
