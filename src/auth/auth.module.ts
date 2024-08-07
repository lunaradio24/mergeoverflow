import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RedisService } from '../redis/redis.service';
import { UserModule } from '../users/user.module';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { SmsModule } from 'src/sms/sms.module';
import { ProfileImage } from 'src/images/entities/profile-image.entity';
import { Heart } from 'src/hearts/entities/heart.entity';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, UserToInterest, UserToTech, ProfileImage, Heart]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRED_IN') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    LocalStrategy,
    RedisService,
    GoogleStrategy,
    GithubStrategy,
  ],
  exports: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
