import { Module, forwardRef } from '@nestjs/common';
import { MatchingService } from '../matchings/matchings.service';
import { MatchingController } from '../matchings/matchings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Heart } from './entities/heart.entity';
import { Matching } from './entities/matching.entity';
import { ChatRoomsModule } from '../chat-rooms/chat-rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Heart, Matching]), ChatRoomsModule],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
