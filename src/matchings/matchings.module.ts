import { Module } from '@nestjs/common';
import { MatchingsService } from './matchings.service';
import { MatchingsController } from './matchings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Heart } from './entities/heart.entity';
import { Matching } from './entities/matching.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Heart, Matching])],
  controllers: [MatchingsController],
  providers: [MatchingsService],
})
export class MatchingsModule {}
