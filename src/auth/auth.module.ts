import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Account } from './entities/account.entity';
import { SmsService } from './sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), SmsModule],
  controllers: [AuthController],
  providers: [AuthService, SmsService, RedisService],
})
export class AuthModule {}
