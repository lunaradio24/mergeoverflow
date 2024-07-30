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
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

// @WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
// export class ChatRoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   constructor(private readonly notificationsService: NotificationsService) {}
//   @WebSocketServer() public server: Server;
//   private logger: Logger = new Logger('chatGateWay');

//   afterInit(server: Server) {
//     this.logger.log(`notifications ${server} init`);
//   }

//   handleConnection(@ConnectedSocket() socket: Socket) {
//     this.logger.log(`Client connected: ${socket.id}`);
//   }

//   handleDisconnect(socket: Socket) {
//     this.logger.log(`Client disconnected: ${socket.id}`);
//   }

//   @SubscribeMessage('createdChatRoom')
//   async handleCreatedChatRoom(
//     @MessageBody() data: { user1Id: number; user2Id: number },
//     @ConnectedSocket() socket: Socket,
//   ) {
//     const { user1Id, user2Id } = data;
//     const chatRoom = await this.chatRoomsService.createdRoom(user1Id, user2Id);
//     socket.join(chatRoom.id.toString());
//     this.logger.log(`유저 ${user1Id}번님과 유저 ${user2Id}번님이 ${chatRoom.id}번방에 머지하였습니다.`);
//   }

//   @SubscribeMessage('join')
//   async handleJoinChatRoom(@MessageBody() data: { userId: number; roomId: number }, @ConnectedSocket() socket: Socket) {
//     const { userId, roomId } = data;
//     const nickname = await this.chatRoomsService.findUser(userId);
//     socket.data = nickname;

//     await this.chatRoomsService.validateChatRoomToUser(userId, roomId);
//     socket.join(roomId.toString());

//     this.logger.log(`${socket.data.nickname}님께서 ${roomId}번 방에 입장했습니다.`);
//   }

//   @SubscribeMessage('exit')
//   async handleExitChatRoom(@MessageBody() data: { userId: number; roomId: number }, @ConnectedSocket() socket: Socket) {
//     const { userId, roomId } = data;
//     await this.chatRoomsService.exitChatRoom(userId, roomId);
//     socket.leave(roomId.toString());
//     this.logger.log(`${socket.data.nickname}님께서  ${roomId}번 방에서 퇴장하셨습니다.`);
//   }

//   @SubscribeMessage('message')
//   async handleMessage(
//     @MessageBody() data: { userId: number; roomId: number; message: string },
//     @ConnectedSocket() socket: Socket,
//   ) {
//     const { userId, roomId, message } = data;
//     const chatMessage = await this.chatRoomsService.savedMessage(userId, roomId, message);
//     this.server.to(roomId.toString()).emit('message', chatMessage);
//     this.logger.log(`${roomId},${userId}:${message}`);
//   }
// }

// namespace (채널) -> room (개별방) -> socket, client
// workspace (채널) -> channel/dm (개별방)
// 1. db 저장주기 (몇 초, 나갈 때)
// 2. 다시 로그인 했을 때
// 1. 채팅 메시지를 db에 저장하는 주기 (매번 보낼때마다 저장하는지, 몇초 간격으로 저장하는지, 채팅방을 나가는 시점에 모든 메시지를 한꺼번에 저장하는지)
// 2. 유저 아이디 2개를 같이 채팅방에 join 시키는 게 맞나? 각각 따로 join 시키는 게 맞는 거 같은데..
