import { Module } from '@nestjs/common';
import { MatchingService } from '../matchings/matchings.service';
import { MatchingController } from '../matchings/matchings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Heart } from './entities/heart.entity';
import { Matching } from './entities/matching.entity';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { HeartResetService } from './heart-reset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Heart, Matching, MatchingPreferences]),
    ChatRoomsModule,
    NotificationsModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService, HeartResetService],
  exports: [MatchingService],
})
export class MatchingModule {}
