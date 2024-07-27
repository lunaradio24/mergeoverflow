import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { CreateDetailUserDto } from './dto/create-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from './dto/interest.dto';
import { CreateTechDto } from './dto/tech.dto';
import { Tech } from './entities/tech.entity';

@Injectable()
export class UsersService {
  // Repository 주입
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Interest)
  private readonly interestRepository: Repository<Interest>;
  @InjectRepository(Tech)
  private readonly techRepository: Repository<Tech>;

  // 내 정보 조회(프로필 조회)

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

  // 프로필 수정
  async updateUserProfile(user: any, updateProfileDto: UpdateProfileDto) {
    // 1. 지금 행동하는 사람이 내가 맞는지 확인
    const userId = user.id;

    const data = await this.userRepository.findOne({
      where: { id: userId },
    });

    // 2. 아니라면 에러를 발생 시켜서 내보내기
    if (!data) {
      throw new NotFoundException('허용되지 않는 사용자입니다.');
    }

    // 3. updateProfileDto로 받은 내용 one or all 업데이트 이때 save?
    await this.userRepository.update(
      // 3-1. update를 하는데 나라는 특정 id를 먼저 찾아야함.(update 메서드의 필수사항)
      { id: userId },
      {
        // 사용자가 넣은 값이 즉 updateProfileDto.smokingFreq가 !== undefined 즉 선택을 했다면 && 옆에 있는 것으로 업데이트 한다.
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

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  // 회원 변경 가능한 정보 데이터에 저장 // 영진님 쓰세요.
  async createDetailUser(createDetailUserDto: CreateDetailUserDto) {
    const data = { ...createDetailUserDto };

    await this.userRepository.save(data);

    return data;
  }

  // 회원 관심사 저장
  async createUserInterest(createInterestDto: CreateInterestDto) {
    const data = { ...createInterestDto };

    await this.interestRepository.save(data);

    return data;
  }

  // 회원 기술사 저장
  async createUserTech(createTechDto: CreateTechDto) {
    const data = { ...createTechDto };

    await this.techRepository.save(data);

    return data;
  }

  // 회원 변경 불가한 정보 데이터에 저장
  async create(createUserDto: CreateUserDto) {
    return;
  }
}
