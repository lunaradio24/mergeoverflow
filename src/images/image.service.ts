import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { ProfileImage } from 'src/users/entities/profile-image.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly s3Service: S3Service,
  ) {}

  // 생성 : 회원가입용 S3에 이미지 업로드
  async uploadImageToS3(file: Express.MulterS3.File): Promise<string> {
    const imageUrl = await this.s3Service.uploadToS3(`${Date.now()}_${file.originalname}`, file);

    return imageUrl;
  }

  // 프로필 이미지 추가
  async createImage(userId: number, file: Express.MulterS3.File): Promise<string> {
    const imageUrl = await this.uploadImageToS3(file);
    const { image } = await this.saveImage(userId, imageUrl);
    return image;
  }

  // 이미지 변경
  async updateImage(userId: number, imageId: number, file: Express.MulterS3.File): Promise<string> {
    const foundImageUrl = await this.findImageById(userId, imageId);

    if (foundImageUrl) {
      await this.deleteImageToS3(foundImageUrl);
    }

    const uploadedImageUrl = await this.uploadImageToS3(file);

    await this.profileImageRepository.update({ id: imageId }, { image: uploadedImageUrl });

    return uploadedImageUrl;
  }

  // 이미지 삭제
  async deleteImage(userId: number, imageId: number) {
    const foundImageUrl = await this.findImageById(userId, imageId);

    await this.deleteImageToS3(foundImageUrl);

    await this.profileImageRepository.delete(imageId);

    return;
  }

  // 조회 : DB에서 imageId로 이미지 찾기
  async findImageById(userId: number, imageId: number): Promise<string> {
    const { image } = await this.profileImageRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('존재하는 이미지가 아닙니다.');
    }

    const exitedUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!exitedUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    return image;
  }

  // 저장 : DB에 이미지 저장
  async saveImage(userId: number, imageUrl: string): Promise<ProfileImage> {
    const savedImage = await this.profileImageRepository.save({ userId, image: imageUrl });
    return savedImage;
  }

  // 삭제 : S3 서버에 이미지 삭제
  async deleteImageToS3(imageUrl: string): Promise<void> {
    await this.s3Service.deleteFromS3(imageUrl);
  }
}
