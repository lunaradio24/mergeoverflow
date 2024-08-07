import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Account]), RedisModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
