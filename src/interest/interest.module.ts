import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Interest } from '../users/entities/interest.entity';
import { Account } from 'src/auth/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest, Account])],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
