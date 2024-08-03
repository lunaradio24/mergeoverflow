import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { S3Module } from 'src/s3/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileImage } from './entities/profile-image.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [S3Module, TypeOrmModule.forFeature([ProfileImage, User])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
