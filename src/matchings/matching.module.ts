import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Heart } from '../hearts/entities/heart.entity';
import { Matching } from './entities/matching.entity';
import { ChatRoomModule } from 'src/chat-rooms/chat-room.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { Preferences } from '../preferences/entities/preferences.entity';
import { HeartService } from 'src/hearts/heart.service';
import { Location } from '../locations/entities/location.entity';
import { LocationService } from '../locations/location.service';
import { LocationController } from '../locations/location.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Heart, Matching, Preferences, Location]),
    ChatRoomModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [MatchingController, LocationController],
  providers: [MatchingService, HeartService, LocationService],
  exports: [MatchingService],
})
export class MatchingModule {}
