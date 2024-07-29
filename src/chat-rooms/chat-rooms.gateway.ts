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
class TestSocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(server: Server) {
    console.log(`chat ${server} init`);
  }
  // @핸드쉐이크 어써라이제이션 , 페이로드 디코드만 ,
  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }
}

@WebSocketGateway(3001, { namespace: 'chat_matchings', cors: 'http://localhost:3001' })
export class ChatRoomsGateway {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('chatGateWay');

  @SubscribeMessage('createdChatRoom')
  async handleCreatedChatRoom(
    @MessageBody() data: { user1Id: number; user2Id: number },
    @ConnectedSocket() socket: Socket,
  ) {
    new TestSocket();
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
