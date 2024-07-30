import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { UserToInterest } from '../users/entities/user-to-interest.entity';
import { UserToTech } from '../users/entities/user-to-tech.entity';
import { SmsModule } from './sms/sms.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, UserToInterest, UserToTech]), SmsModule, RedisModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
