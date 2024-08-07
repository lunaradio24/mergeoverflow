import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoomGateway } from './chat-room.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage]), JwtModule, UserModule, NotificationModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, ChatRoomGateway],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
