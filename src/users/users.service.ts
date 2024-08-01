import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Account } from 'src/auth/entities/account.entity';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { compare, hash } from 'bcrypt';
import { aw } from '@upstash/redis/zmscore-80635339';
import { ProfileImage } from './entities/profile-image.entity';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UsersService {
  // Repository 주입
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,
    // S3Service
    private readonly s3Service: S3Service,
  ) {}

  /**
   * 내 정보 조회, 프로필 조회
   * @param user
   * @returns
   */

  // 토큰에서 사용자 정보 추출
  async find(user: any) {
    // JWT 토큰에서 사용자의 ID를 추출해
    const userId = user.id;

    // ID로 사용자를 찾아
    const data = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 사용자의 정보를 반환해
    return data;
  }

  /**
   * 프로필 수정
   * @param user
   * @param updateProfileDto
   * @returns
   */
  async updateUserProfile(user: any, updateProfileDto: UpdateProfileDto) {
    const userId = user.id;

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    await this.userRepository.update(
      // 3-1. update를 하는데 나라는 특정 id를 먼저 찾아야함.(update 메서드의 필수사항)
      { id: userId },
      {
        // 사용자가 넣은 값 즉 updateProfileDto.smokingFreq가 !== undefined 즉 "선택"을 했다면 && 옆에 있는 것으로 업데이트 한다.
        // { smokingFreq: updateProfileDto.smokingFreq } 즉 사용자가 새롭게 선택한 updateProfileDto.smokingFreq를 smokingFreq라고 한다.
        // 바로 위의 {} 속에서 smokingFreq는 DB속의 컬럼의 이름이 되시겠다.
        // &&의 의미 왼쪽이 참이라면 즉 "사용자가 선택을 했다면!" === undefined가 아니라면 === true라면 왼쪽을 실행시켜라
        ...(updateProfileDto.smokingFreq !== undefined && { smokingFreq: updateProfileDto.smokingFreq }),
        ...(updateProfileDto.drinkingFreq !== undefined && { drinkingFreq: updateProfileDto.drinkingFreq }),
        ...(updateProfileDto.religion !== undefined && { religion: updateProfileDto.religion }),
        ...(updateProfileDto.mbti !== undefined && { mbti: updateProfileDto.mbti }),
        ...(updateProfileDto.height !== undefined && { height: updateProfileDto.height }),
        ...(updateProfileDto.bodyShape !== undefined && { bodyShape: updateProfileDto.bodyShape }),
        ...(updateProfileDto.pet !== undefined && { pet: updateProfileDto.pet }),
        ...(updateProfileDto.region !== undefined && { region: updateProfileDto.region }),
        ...(updateProfileDto.bio !== undefined && { bio: updateProfileDto.bio }),
      },
    );

    const updateProfile = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 4. 다시금 그걸 반환해주기
    return updateProfile;
  }

  /**
   * 비밀번호 수정
   * @param id
   * @param updatePasswordDto
   * @returns
   */
  async updatePassword(user: any, updatePasswordDto: UpdatePasswordDto) {
    const userId = user.id;

    const data = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!data) {
      throw new NotFoundException('허용되지 않는 사용자입니다.');
    }

    // 기존의 패스워드를 입력해서 존재하는 유저인지 확인
    const findUser = await this.accountRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // 비밀번호 비교
    const existingPassword = await compare(updatePasswordDto.password, findUser.password);

    if (!existingPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // 새로운 비밀번호 해싱 // 10을 content에다가 넣을까?
    const hashedNewPassword = await hash(updatePasswordDto.newPassword, 10);

    // 비밀번호는 회원정보(auth)니까 authRepository가 되나?
    await this.accountRepository.update(userId, { password: hashedNewPassword });

    const updatePassword = await this.accountRepository.findOne({
      where: userId,
    });

    return updatePassword;
  }

  // 프로필 이미지 추가
  async createProfileImage(userId: number, file: Express.MulterS3.File) {
    // 1. 유저 존재 확인
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    // 2. S3에 이미지 업로드 후 URL 반환
    const imageUrl = await this.s3Service.imageUploadToS3(`${Date.now()}_${file.originalname}`, file);

    const savedImage = await this.profileImageRepository.save({ userId, image: imageUrl });

    return savedImage;
  }

  // 프로필 이미지 변경
  async updateProfileImage(userId: number, imageId: number, file: Express.MulterS3.File) {
    // 1. 유저 존재 확인
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    // 2. 존재하는 이미지 인지 확인
    const foundImage = await this.profileImageRepository.findOne({
      where: { id: imageId },
    });

    if (!foundImage) {
      throw new NotFoundException('존재하지 않은 이미지입니다.');
    }

    // 3. 파일을 S3에 업로드하고 URL 반환
    const imageUrl = await this.s3Service.imageUploadToS3(`${Date.now()}_${file.originalname}`, file);
    // Date.now()는 중복을 막기 위해서

    // 4. 해당 이미지 Id의 URL을 수정한다.
    await this.profileImageRepository.update({ id: imageId }, { image: imageUrl });

    // 도전과제 5. S3에서 변경 전 이미지를 삭제한다.

    return imageUrl;
  }

  // // 프로필 이미지 삭제
  // async deleteProfileImage(userId: number, imageId: number) {
  //   // 1. 유저 존재 확인
  //   const foundUser = await this.userRepository.findOne({
  //     where: { id: userId },
  //   });

  //   if (!foundUser) {
  //     throw new NotFoundException('존재하지 않는 사용자입니다.');
  //   }

  //   // 2. 존재하는 이미지 인지 확인
  //   const foundImage = await this.profileImageRepository.findOne({
  //     where: { id: imageId },
  //   });

  //   if (!foundImage) {
  //     throw new NotFoundException('존재하지 않은 이미지입니다.');
  //   }

  //   // 이미지 S3에서 삭제
  //   // 먼저 S3에서 삭제하고 그 다음 DB에서 삭제한다.
  //   const
  // }

  // 닉네임 중복 확인
  async checkName(checkNicknameDto: CheckNicknameDto) {
    // 1.userRepository에 같은 닉네임이 있는지 확인
    const checkName = await this.userRepository.findOne({
      where: { nickname: checkNicknameDto.nickname },
    });

    // 2, 있다면 에러를 발생
    if (checkName) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    return;
  }
}
