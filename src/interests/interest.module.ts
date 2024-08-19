import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interest, UserToInterest])],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
