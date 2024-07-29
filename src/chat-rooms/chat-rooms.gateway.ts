import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomsService } from './chat-rooms.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chat_matchings' })
export class ChatRoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('chatGateWay');

  afterInit(server: Server) {
    this.logger.log(`chat ${server} init`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('createdChatRoom')
  async handleCreatedChatRoom(
    @MessageBody() data: { user1Id: number; user2Id: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const { user1Id, user2Id } = data;
    const chatRoom = await this.chatRoomsService.createdRoom(user1Id, user2Id);
    socket.join(chatRoom.toString());
    this.logger.log(`${user1Id}와 ${user2Id}님이 매칭되었습니다.`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { userId: number; roomId: number; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId, roomId, message } = data;
    const chatMessage = await this.chatRoomsService.savedMessage(userId, roomId, message);
    this.server.to(data.roomId.toString()).emit('message', chatMessage);
    this.logger.log(`Client ${roomId} sent message to room ${message}`);
  }
}

// namespace (채널) -> room (개별방)
// workspace (채널) -> channel/dm (개별방)
