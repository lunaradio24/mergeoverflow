import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
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
    const token = socket.handshake.auth.token;
    if (!token) {
      this.logger.error(`[연결 강제 종료] 소켓 ID : ${socket.id}, status: 401, 토큰이 제공되지 않았습니다.`);
      socket.disconnect();
      return null;
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
      return decoded;
    } catch (error) {
      this.logger.error(
        `[연결 강제 종료] 소켓 ID : ${socket.id}, status: ${error.status}, 유효하지 않은 토큰입니다: ${error.message}`,
      );
      socket.disconnect();
      return null;
    }
  }
}
