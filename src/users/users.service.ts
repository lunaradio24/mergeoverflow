import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { CreateDetailUserDto } from './dto/create-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateTechDto } from './dto/tech.dto';
import { Tech } from './entities/tech.entity';
import { UserToInterestDto } from '../interest/dto/userToInterest.dto';
import { UserToInterest } from './entities/user-to-interest.entity';
import { UpdatePassWordDto } from './dto/updatePassWord.dto';
import { Account } from 'src/auth/entities/account.entity';
import { CheckNickNameDto } from './dto/checkNickName.dto';

import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  // Repository 주입
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Interest)
  private readonly interestRepository: Repository<Interest>;
  @InjectRepository(UserToInterest)
  private readonly userToInterestRepository: Repository<UserToInterest>;
  @InjectRepository(Tech)
  private readonly techRepository: Repository<Tech>;
  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>;

  /**
   * 내 정보 조회, 프로필 조회
   * @param user
   * @returns
   */
  // 토큰에서 사용자 정보 추출
  async find(id: number) {
    // JWT 토큰에서 사용자의 ID를 추출해
    // const userId = user.id;

    // ID로 사용자를 찾아
    const data = await this.userRepository.findOne({
      where: { id: id }, //       where: { id: userId },
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
  async updateUserProfile(id: number, updateProfileDto: UpdateProfileDto) {
    // user: any,
    // 1. 지금 행동하는 사람이 내가 맞는지 확인
    const userId = id; //    const userId = user.id;

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

  // // 회원 관심사 저장
  // async createUserInterest(user: any, interestDto: UserToInterestDto) {
  //   // 1. 지금 행동하는 사람이 내가 맞는지 확인
  //   const userId = user.id;

  //   const data = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['userToInterests'], //typeOrm에 의해서 문자열로 받고 나중에 확장성을 위해서 []로 받는다.
  //   });

  //   // 2. 아니라면 에러를 발생 시켜서 내보내기
  //   if (!data) {
  //     throw new NotFoundException('허용되지 않는 사용자입니다.');
  //   }

  //   // 기존의 회원의 관심사 삭제 및 초기화
  //   await this.userToInterestRepository.delete({ userId });

  //   // 새로운 관심사 저장
  //   const userInterests = interestDto.interestIds.map((interestId) => {
  //     const userToInterest = new UserToInterest();
  //     userToInterest.userId = userId;
  //     userToInterest.interestId = interestId;
  //     return userToInterest;
  //   });

  //   await this.userToInterestRepository.save(userInterests);

  //   // 업데이트된 사용자 데이터를 반환합니다.
  //   const updatedUser = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['userToInterests', 'userToInterests.interest'], // 새롭게 저장된 관심사와 함께 사용자 데이터를 로드합니다.
  //   });

  //   return updatedUser;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  /**
   * 비밀번호 수정
   * @param id
   * @param updatePassWordDto
   * @returns
   */
  async updatePassWord(id: number, updatePassWordDto: UpdatePassWordDto) {
    // 기존의 패스워드를 입력해서 존재하는 유저인지 확인
    const findUser = await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!findUser) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    // 비밀번호 비교
    const existingPassWord = await compare(updatePassWordDto.password, findUser.password);

    if (!existingPassWord) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // 새로운 비밀번호 해싱 // 10을 content에다가 넣을까?
    const hashedNewPassword = await hash(updatePassWordDto.newPassword, 10);

    // 비밀번호는 회원정보(auth)니까 authRepository가 되나?
    await this.accountRepository.update({ id }, { password: hashedNewPassword });

    const updatePassWord = await this.accountRepository.findOne({
      where: { id },
    });

    return updatePassWord;
  }

  async checkName(checkNickNameDto: CheckNickNameDto) {
    // 1.userRepository에 같은 닉네임이 있는지 확인
    const checkName = await this.userRepository.findOne({
      where: { nickname: checkNickNameDto.nickname },
    });

    // 2, 있다면 에러를 발생
    if (checkName) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    // 없다면 반환
    return;
  }

  // 회원 변경 가능한 정보 데이터에 저장 // 영진님 쓰세요.
  async createDetailUser(createDetailUserDto: CreateDetailUserDto) {
    const data = { ...createDetailUserDto };

    await this.userRepository.save(data);

    return data;
  }

  // 회원 기술사 저장 // 영진님 쓰세요.
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
