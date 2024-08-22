import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Account } from 'src/auth/entities/account.entity';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { compare, hash } from 'bcrypt';
import { USER_MESSAGES } from './constants/user.message.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  // Repository 주입
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly configService: ConfigService,
  ) {}

  /**
   * 내 정보 조회, 프로필 조회
   * @param user
   * @returns
   */
  async findByUserId(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account', 'images', 'userToInterests', 'userToTechs'],
      cache: true,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async validateUserExists(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      cache: true,
    });
    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
    }
    return true;
  }

  /**
   * 프로필 수정
   * @param user
   * @param updateProfileDto
   * @returns
   */
  async updateUserProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<boolean> {
    const userId = user.id;
    const existingUser = await this.userRepository.findOne({ where: { id: userId } });

    if (!existingUser) {
      throw new NotFoundException(USER_MESSAGES.FIND.ONE.FAILURE.NOT_FOUND);
    }
    await this.userRepository.update({ id: userId }, updateProfileDto);

    return true;
  }

  /**
   * 비밀번호 수정
   * @param id
   * @param updatePasswordDto
   * @returns
   */
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<boolean> {
    const { password, newPassword, newPasswordConfirm } = updatePasswordDto;

    // 존재하는 유저인지 확인
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['account'],
      select: { account: { password: true, provider: true } },
    });

    if (!existingUser) {
      throw new NotFoundException(USER_MESSAGES.FIND.ONE.FAILURE.NOT_FOUND);
    }

    // 소셜 로그인 유저인지 확인
    if (existingUser.account.provider !== 'local') {
      throw new ForbiddenException('휴대폰 번호로 로그인한 유저만 비밀번호를 변경할 수 있습니다.');
    }

    // 기존 비밀번호 맞는지 확인
    const passwordInput = updatePasswordDto.password;
    const currHashedPassword = existingUser.account.password;
    const isMatched = await compare(passwordInput, currHashedPassword);

    if (!isMatched) {
      throw new BadRequestException(USER_MESSAGES.UPDATE_PASSWORD.FAILURE.WRONG_PW);
    }

    // 기존 비밀번호와 일치하는지 확인
    if (password === newPassword) {
      throw new BadRequestException('기존 비밀번호와 다른 비밀번호를 입력해주세요.');
    }

    // 새로운 비밀번호 해싱
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'));
    const hashedNewPassword = await hash(updatePasswordDto.newPassword, hashRounds);

    await this.accountRepository.update({ id: existingUser.accountId }, { password: hashedNewPassword });

    return true;
  }

  // 닉네임 중복 확인
  async isAvailableNickname(checkNicknameDto: CheckNicknameDto): Promise<boolean> {
    // 1.userRepository에 같은 닉네임이 있는지 확인
    const existingNickname = await this.userRepository.findOne({
      where: { nickname: checkNicknameDto.nickname },
    });

    // 2, 있다면 false 반환
    if (existingNickname) {
      throw new ConflictException(USER_MESSAGES.NICKNAME.FAILURE.DUPLICATE);
    }

    // 3. 없다면 true 반환
    return true;
  }

  async findNicknameByUserId(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['nickname'] });
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.FIND.ONE.FAILURE.NOT_FOUND);
    }
    return user.nickname;
  }
}
