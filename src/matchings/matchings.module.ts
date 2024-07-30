import { Module } from '@nestjs/common';
import { MatchingService } from '../matchings/matchings.service';
import { MatchingController } from '../matchings/matchings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Heart } from './entities/heart.entity';
import { Matching } from './entities/matching.entity';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Heart, Matching]), ChatRoomsModule],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
