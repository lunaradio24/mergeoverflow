import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import { ProfileImage } from './entities/profile-image.entity';
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

  // 저장 : DB에 이미지 저장
  async saveImage(userId: number, imageUrl: string): Promise<ProfileImage> {
    const savedImage = await this.profileImageRepository.save({ userId, imageUrl: imageUrl });
    return savedImage;
  }

  // 삭제 : S3 서버에 이미지 삭제
  async deleteImageToS3(imageUrl: string): Promise<void> {
    await this.s3Service.deleteFromS3(imageUrl);
  }

  // 프로필 이미지 추가
  async createImage(userId: number, file: Express.MulterS3.File): Promise<ProfileImage> {
    const uploadedImageUrl = await this.uploadImageToS3(file);
    const savedImage = await this.saveImage(userId, uploadedImageUrl);
    return savedImage;
  }

  // 이미지 변경
  async updateImage(userId: number, imageId: number, file: Express.MulterS3.File): Promise<string> {
    // 존재하는 이미지인지 확인
    const foundImage = await this.findImageById(imageId);

    // 내 이미지인지 확인
    if (userId !== foundImage.userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    // S3에서 기존 이미지 삭제
    await this.deleteImageToS3(foundImage.imageUrl);

    // S3에 변경할 이미지 업로드
    const uploadedImageUrl = await this.uploadImageToS3(file);

    // DB에서 이미지 수정
    await this.profileImageRepository.update({ id: imageId }, { imageUrl: uploadedImageUrl });

    return uploadedImageUrl;
  }

  // 이미지 삭제
  async deleteImage(userId: number, imageId: number): Promise<void> {
    // 존재하는 이미지인지 확인
    const foundImage = await this.findImageById(imageId);

    // 내 이미지인지 확인
    if (userId !== foundImage.userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    // S3에서 이미지 삭제
    await this.deleteImageToS3(foundImage.imageUrl);

    // DB에서 이미지 삭제
    await this.profileImageRepository.delete(imageId);
    return;
  }

  // 조회 : DB에서 imageId로 이미지 찾기
  async findImageById(imageId: number): Promise<ProfileImage> {
    const image = await this.profileImageRepository.findOne({
      where: { id: imageId },
    });

    // 존재하는 이미지인지 확인
    if (!image) throw new NotFoundException('존재하는 이미지가 아닙니다.');

    return image;
  }
}
