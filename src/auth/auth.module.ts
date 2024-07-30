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
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, UserToInterest, UserToTech]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRED_IN') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UsersModule,
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, LocalStrategy, RedisService, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
