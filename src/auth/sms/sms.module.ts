import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Account]), RedisModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
