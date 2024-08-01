import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class SocketGateway {
  jwtService: JwtService;
  name: string;
  logger: Logger;

  constructor({ jwtService, name }: { jwtService: JwtService; name: string }) {
    this.jwtService = jwtService;
    this.name = name;
    this.logger = new Logger(name);
  }
  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    this.logger.log(`${this.name} ${server} init`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`[${this.name} 서버 연결 해제] 소켓 ID : ${socket.id}`);
  }

  parseToken(@ConnectedSocket() socket: Socket) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('토큰이 유효하지 않습니다.');
      }
      const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
      return decoded;
    } catch (error) {
      console.error(`[연결 강제 종료] 소켓 ID : ${socket.id} , status: ${error.status}, ${error.message}`);
      socket.disconnect();
    }
  }
}
