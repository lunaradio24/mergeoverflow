import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Account } from './entities/account.entity';
import { SmsService } from 'src/sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { LocalSignUpDto } from './dto/local-sign-up.dto';
import { User } from '../users/entities/user.entity';
import { UserToInterest } from '../users/entities/user-to-interest.entity';
import { UserToTech } from '../users/entities/user-to-tech.entity';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { LocalSignInDto } from './dto/local-sign-in.dto';
import { CODE_TTL_IN_SECONDS } from './constants/auth.constant';
import { MAX_NUM_INTERESTS, MIN_NUM_INTERESTS } from 'src/interests/constants/interest.constant';
import { MAX_NUM_TECHS, MIN_NUM_TECHS } from 'src/techs/constants/tech.constant';
import { MAX_NUM_IMAGES } from 'src/images/constants/image.constant';
import { ProfileImage } from 'src/images/entities/profile-image.entity';
import { Heart } from 'src/hearts/entities/heart.entity';
import { RESET_HEART_COUNT } from 'src/hearts/constants/heart.constant';
import { AUTH_MESSAGES } from './constants/auth.message.constant';
import { IMAGE_MESSAGES } from 'src/images/constants/image.message.constant';
import { INTEREST_MESSAGES } from 'src/interests/constants/interest.message.constant';
import { TECH_MESSAGES } from 'src/techs/constants/tech.message.constant';
import { LocalPayload } from './interfaces/local-payload.interface';
import { SocialPayload } from './interfaces/social-payload.interface';
import { Location } from 'src/locations/entities/location.entity';
import { Preferences } from 'src/preferences/entities/preferences.entity';
import { TokensRO } from './ro/tokens.ro';
import { SocialSignInDto } from './dto/social-sign-in.dto';
import { SocialSignUpDto } from './dto/social-sign-up.dto';

@Injectable()
export class AuthService {
  private readonly accessKey: string;
  private readonly accessExp: string;
  private readonly refreshKey: string;
  private readonly refreshExp: string;

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {
    this.accessKey = this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY');
    this.accessExp = this.configService.get<string>('ACCESS_TOKEN_EXPIRED_IN');
    this.refreshKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');
    this.refreshExp = this.configService.get<string>('REFRESH_TOKEN_EXPIRED_IN');
  }

  async sendSmsForVerification(phoneNum: string): Promise<boolean> {
    const existingAccount = await this.accountRepository.findOne({ where: { phoneNum } });

    if (existingAccount) {
      throw new ConflictException(AUTH_MESSAGES.SMS_SEND.FAILURE.DUPLICATED);
    }

    await this.smsService.sendSmsForVerification(phoneNum);
    return true;
  }

  async verifyCode(phoneNum: string, code: string): Promise<boolean> {
    const storedPhoneNum = await this.redisService.get(code);
    if (storedPhoneNum !== phoneNum) {
      throw new UnauthorizedException(AUTH_MESSAGES.SMS_VERIFY.FAILURE.WRONG_CODE);
    }

    // 인증된 전화번호를 Redis에 저장 (유효기간 설정)
    await this.redisService.setWithTTL(`verified_${phoneNum}`, phoneNum, CODE_TTL_IN_SECONDS);

    return true;
  }

  async signUp(signUpDto: LocalSignUpDto): Promise<boolean> {
    const { phoneNum, password, interests, techs, profileImageUrls, ...userData } = signUpDto;

    // 전화번호 인증 확인
    const verifiedPhoneNum = await this.redisService.get(`verified_${phoneNum}`);
    if (!verifiedPhoneNum) {
      throw new BadRequestException(AUTH_MESSAGES.SIGN_UP.FAILURE.REQUIRE_SMS_VERIFICATION);
    }

    // 전화번호 중복 확인
    const isDuplicate = await this.checkDuplicatePhoneNum(phoneNum);
    if (isDuplicate) {
      throw new ConflictException(AUTH_MESSAGES.COMMON.PHONE_NUM.DUPLICATED);
    }

    // 비밀번호 해싱
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'));
    const hashedPassword = await hash(password, hashRounds);

    // profileImageUrls 검증
    if (profileImageUrls.length > MAX_NUM_IMAGES) {
      throw new BadRequestException(IMAGE_MESSAGES.CREATE.FAILURE.UPPER_LIMIT);
    }

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Account 생성 및 저장
      const account = new Account();
      account.password = hashedPassword;
      account.phoneNum = phoneNum;

      const savedAccount = await queryRunner.manager.save(account);

      // User 데이터 생성
      if (interests.length < MIN_NUM_INTERESTS) {
        throw new BadRequestException(INTEREST_MESSAGES.CREATE.FAILURE.LOWER_LIMIT);
      }

      if (interests.length > MAX_NUM_INTERESTS) {
        throw new BadRequestException(INTEREST_MESSAGES.CREATE.FAILURE.UPPER_LIMIT);
      }

      if (techs.length < MIN_NUM_TECHS) {
        throw new BadRequestException(TECH_MESSAGES.CREATE.FAILURE.LOWER_LIMIT);
      }

      if (techs.length > MAX_NUM_TECHS) {
        throw new BadRequestException(TECH_MESSAGES.CREATE.FAILURE.UPPER_LIMIT);
      }

      const user = plainToClass(User, userData);
      user.accountId = savedAccount.id;
      const savedUser = await queryRunner.manager.save(user);

      // UserToInterest 생성
      const userToInterests = interests.map((interestId) => {
        const userToInterest = new UserToInterest();
        userToInterest.userId = savedUser.id;
        userToInterest.interestId = interestId;
        return userToInterest;
      });
      await queryRunner.manager.save(userToInterests);

      // UserToTech 생성
      const userToTechs = techs.map((techId) => {
        const userToTech = new UserToTech();
        userToTech.userId = savedUser.id;
        userToTech.techId = techId;
        return userToTech;
      });
      await queryRunner.manager.save(userToTechs);

      // ProfileImage 생성
      if (profileImageUrls && profileImageUrls.length > 0) {
        const userProfileImages = profileImageUrls.map((url) => {
          const userProfileImage = new ProfileImage();
          userProfileImage.userId = savedUser.id;
          userProfileImage.imageUrl = url;
          return userProfileImage;
        });
        await queryRunner.manager.save(userProfileImages);
      }

      // Heart 데이터 생성 및 저장
      const heart = new Heart();
      heart.userId = savedUser.id;
      heart.remainHearts = RESET_HEART_COUNT;
      await queryRunner.manager.save(heart);

      // Location 데이터 생성 및 저장
      const location = new Location();
      location.userId = savedUser.id;
      await queryRunner.manager.save(location);

      // Preferences 데이터 생성 및 저장
      const preferences = new Preferences();
      preferences.userId = savedUser.id;
      await queryRunner.manager.save(preferences);

      // 트랜잭션 종료
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async socialSignIn(
    socialSignInDto: SocialSignInDto,
  ): Promise<{ tokens: TokensRO | null; provider: string; providerId: string }> {
    try {
      const { provider, providerId } = socialSignInDto;

      const account = await this.accountRepository.findOne({ where: { provider, providerId }, relations: ['user'] });

      if (!account) {
        //계정이 없으면 null 반환, 회원가입이 필요.
        return { tokens: null, provider, providerId };
      }

      const userId = account.user.id;
      const payload = { userId, provider, providerId };
      const tokens = await this.issueTokens(payload);

      return { tokens, provider, providerId };
    } catch (error) {
      throw new UnauthorizedException(AUTH_MESSAGES.SIGN_IN.FAILURE);
    }
  }

  async socialSignUp(socialSignUpDto: SocialSignUpDto, provider: string, providerId: string): Promise<boolean> {
    const { interests, techs, profileImageUrls, ...userData } = socialSignUpDto;

    // profileImageUrls 검증
    if (profileImageUrls.length > MAX_NUM_IMAGES) {
      throw new BadRequestException(IMAGE_MESSAGES.CREATE.FAILURE.UPPER_LIMIT);
    }

    // 트랜잭션 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //이미 존재하는 Account 조회
      const account = await this.accountRepository.findOne({
        where: { provider, providerId },
        relations: ['user'],
      });

      if (account) {
        throw new ConflictException('이미 존재하는 계정입니다.');
      }

      // 새로운 Account 생성
      const newAccount = new Account();
      newAccount.provider = provider;
      newAccount.providerId = providerId;
      const savedAccount = await queryRunner.manager.save(newAccount);

      // 새로운 User 생성
      const user = plainToClass(User, userData);
      user.accountId = savedAccount.id;
      const savedUser = await queryRunner.manager.save(user);

      // UserToInterest 생성
      const userToInterests = interests.map((interestId) => {
        const userToInterest = new UserToInterest();
        userToInterest.userId = user.id;
        userToInterest.interestId = interestId;
        return userToInterest;
      });
      await queryRunner.manager.save(userToInterests);

      // UserToTech 생성
      const userToTechs = techs.map((techId) => {
        const userToTech = new UserToTech();
        userToTech.userId = user.id;
        userToTech.techId = techId;
        return userToTech;
      });
      await queryRunner.manager.save(userToTechs);

      // ProfileImage 생성
      if (profileImageUrls && profileImageUrls.length > 0) {
        const userProfileImages = profileImageUrls.map((url) => {
          const userProfileImage = new ProfileImage();
          userProfileImage.userId = user.id;
          userProfileImage.imageUrl = url;
          return userProfileImage;
        });
        await queryRunner.manager.save(userProfileImages);
      }

      // Heart 데이터 생성 및 저장
      const heart = new Heart();
      heart.user = user;
      heart.remainHearts = RESET_HEART_COUNT;
      await queryRunner.manager.save(heart);

      // Location 데이터 생성 및 저장
      const location = new Location();
      location.user = user;
      await queryRunner.manager.save(location);

      // Preferences 데이터 생성 및 저장
      const preferences = new Preferences();
      preferences.user = user;
      await queryRunner.manager.save(preferences);

      // 트랜잭션 종료
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validateUserBySignInDto(signInDto: LocalSignInDto): Promise<LocalPayload | null> {
    const { phoneNum, password } = signInDto;
    const account = await this.accountRepository.findOne({
      where: { phoneNum },
      relations: ['user'],
      select: ['id', 'phoneNum', 'password', 'user'],
    });

    if (account && (await compare(password, account.password))) {
      return { userId: account.user.id, phoneNum: account.phoneNum };
    }
    return null;
  }

  async validateSocialUser(provider: string, providerId: string): Promise<User | null> {
    const account = await this.accountRepository.findOne({ where: { provider, providerId }, relations: ['user'] });
    return account ? account.user : null;
  }

  async signIn(payload: LocalPayload): Promise<TokensRO> {
    const { userId } = payload;

    // 토큰 발급
    const tokens = await this.issueTokens(payload);
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'));
    const hashedRefreshToken = await hash(tokens.refreshToken, hashRounds);

    // Redis에 리프레시 토큰 저장 (기존 토큰을 덮어씀)
    await this.redisService.set(`refresh_token_${userId}`, hashedRefreshToken);

    return tokens;
  }

  async signOut(userId: number): Promise<boolean> {
    // redis에서 로그인 여부 확인
    const token = await this.redisService.get(`refresh_token_${userId}`);
    if (!token) {
      throw new NotFoundException(AUTH_MESSAGES.SIGN_OUT.FAILURE.ALREADY_SIGNED_OUT);
    }

    // Redis에서 Refresh Token 삭제
    await this.redisService.del(`refresh_token_${userId}`);
    return true;
  }

  async renewTokens(refreshToken: string): Promise<TokensRO> {
    // Refresh Token에서 payload 추출
    const decoded = await this.jwtService.verify(refreshToken, { secret: this.refreshKey });
    const { iat, exp, ...payload } = decoded;
    const { userId } = payload;

    // 유효한 Refresh Token인지 검증
    const isValidToken = await this.compareRefreshToken(userId, refreshToken);
    if (!isValidToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.COMMON.JWT.INVALID);
    }

    // 토큰 재발급
    const tokens = await this.issueTokens(payload);
    await this.redisService.set(`refresh_token_${userId}`, tokens.refreshToken);
    return tokens;
  }

  private async issueTokens(payload: LocalPayload | SocialPayload): Promise<TokensRO> {
    const accessToken = this.jwtService.sign(payload, { secret: this.accessKey, expiresIn: this.accessExp });
    const refreshToken = this.jwtService.sign(payload, { secret: this.refreshKey, expiresIn: this.refreshExp });

    return { accessToken, refreshToken };
  }

  private async compareRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
    // Redis에서 Refresh Token 확인
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    if (!storedToken) {
      return false;
    }

    // Redis에 저장된 Refresh Token과 비교
    const isMatch = await compare(refreshToken, storedToken);
    if (!isMatch) {
      return false;
    }

    return true;
  }

  private async checkDuplicatePhoneNum(phoneNum: string): Promise<boolean> {
    const existingAccount = await this.accountRepository.findOne({ where: { phoneNum } });
    if (existingAccount) {
      return true;
    }
    return false;
  }
}
