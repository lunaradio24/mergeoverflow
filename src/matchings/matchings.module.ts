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
import { Location } from '../location/entities/location.entity';
import { LocationService } from '../location/location.service';
import { LocationController } from '../location/location.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Heart, Matching, MatchingPreferences, Location]),
    ChatRoomsModule,
    NotificationsModule,
  ],
  controllers: [MatchingController, LocationController],
  providers: [MatchingService, HeartResetService, LocationService],
  exports: [MatchingService],
})
export class MatchingModule {}
