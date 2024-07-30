import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Account } from './entities/account.entity';
import { SmsService } from './sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../users/entities/user.entity';
import { UserToInterest } from '../users/entities/user-to-interest.entity';
import { UserToTech } from '../users/entities/user-to-tech.entity';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { MAX_INTERESTS, MAX_TECHS, MIN_INTERESTS, MIN_TECHS } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToInterest)
    private readonly userToInterestRepository: Repository<UserToInterest>,
    @InjectRepository(UserToTech)
    private readonly userToTechRepository: Repository<UserToTech>,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly connection: Connection,
  ) {}

  async sendSmsForVerification(phoneNum: string) {
    const formattedPhoneNum = phoneNum.replace(/-/g, '');
    const foundAccount = await this.accountRepository.findOne({ where: { phoneNum: formattedPhoneNum } });

    if (foundAccount) {
      throw new ConflictException('이미 존재하는 전화번호입니다.');
    }

    return await this.smsService.sendSmsForVerification(formattedPhoneNum);
  }

  async verifyCode(phoneNum: string, code: string) {
    const storedPhoneNum = await this.redisService.get(code);
    if (storedPhoneNum !== phoneNum) {
      throw new NotFoundException('잘못된 인증번호입니다.');
    }
    return { message: '인증 성공' };
  }

  async signUp(signUpDto: SignUpDto) {
    const { phoneNum, password, code, interests, techs, ...userData } = signUpDto;

    // 전화번호 인증 코드 검증
    const verificationResult = await this.verifyCode(phoneNum, code);
    if (verificationResult.message !== '인증 성공') {
      throw new BadRequestException('인증 실패');
    }

    // 비밀번호 해싱
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'));
    const hashedPassword = await hash(password, hashRounds);

    // 트랜잭션 시작
    return await this.connection.transaction(async (manager) => {
      // Account 생성 및 저장
      const formattedPhoneNum = phoneNum.replace(/-/g, '');
      const account = new Account();
      account.password = hashedPassword;
      account.phoneNum = formattedPhoneNum;

      const savedAccount = await manager.save(account);

      // User 데이터 생성
      if (interests.length < MIN_INTERESTS || interests.length > MAX_INTERESTS) {
        throw new BadRequestException(`관심사는 최소 ${MIN_INTERESTS}개, 최대 ${MAX_INTERESTS}개 선택해야 합니다.`);
      }

      if (techs.length < MIN_TECHS || techs.length > MAX_TECHS) {
        throw new BadRequestException(`기술 스택은 최소 ${MIN_TECHS}개, 최대 ${MAX_TECHS}개 선택해야 합니다.`);
      }

      //평범한 객체(userData)를 User 클래스의 인스턴스로 변환
      const user = plainToClass(User, userData);
      user.accountId = savedAccount.id;
      const savedUser = await manager.save(user);

      // UserToInterest 생성
      for (const interestId of interests) {
        const userToInterest = new UserToInterest();
        userToInterest.userId = savedUser.id;
        userToInterest.interestId = interestId;
        await manager.save(userToInterest);
      }

      // UserToTech 생성
      for (const techId of techs) {
        const userToTech = new UserToTech();
        userToTech.userId = savedUser.id;
        userToTech.techId = techId;
        await manager.save(userToTech);
      }

      return { message: '회원가입 성공' };
    });
  }

  async validateUser(signInDto: SignInDto) {
    const { phoneNum, password } = signInDto;
    const account = await this.accountRepository.findOne({ where: { phoneNum } });
    if (account && (await compare(password, account.password))) {
      return account;
    }
    return null;
  }

  async validateUserById(userId: number) {
    const account = await this.accountRepository.findOne({ where: { id: userId } });
    if (account) {
      return account;
    }
    return null;
  }

  async signIn(userId: number, phoneNum: string) {
    const payload = { id: userId, phoneNum };

    // Redis에서 로그인 여부 확인
    const token = await this.redisService.get(`refresh_token_${userId}`);
    if (token) {
      throw new BadRequestException('이미 로그인 하셨습니다.');
    }

    // 토큰 발급
    const tokens = await this.issueTokens(payload);
    await this.redisService.set(`refresh_token_${userId}`, tokens.refreshToken);
    return tokens;
  }

  async signOut(userId: number) {
    // redis에서 로그인 여부 확인
    const token = await this.redisService.get(`refresh_token_${userId}`);
    if (!token) {
      throw new NotFoundException('로그인한 기록이 없습니다.');
    }

    // Redis에서 Refresh Token 삭제
    await this.redisService.del(`refresh_token_${userId}`);
  }

  async renewTokens(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
    });

    // Redis에서 Refresh Token 확인
    const token = await this.redisService.get(`refresh_token_${decoded.id}`);
    if (!token || token !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    // 토큰 재발급
    const payload = { id: decoded.id, phoneNum: decoded.phoneNum };
    const tokens = await this.issueTokens(payload);
    await this.redisService.set(`refresh_token_${decoded.id}`, tokens.refreshToken);
    return tokens;
  }

  private async issueTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRED_IN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRED_IN'),
    });

    return { accessToken, refreshToken };
  }
}
