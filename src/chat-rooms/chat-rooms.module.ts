import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatRoom, ChatMessage]), NotificationsModule, JwtModule],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, ChatRoomsGateway],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
