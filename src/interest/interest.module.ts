import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Interest } from '../users/entities/interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest])],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
