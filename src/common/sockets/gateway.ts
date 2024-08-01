import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class SocketGateway {
  jwtService: any;

  injectJwtService(jwtService) {
    this.jwtService = jwtService;
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
      console.error(`${socket.id} 연결 강제 종료, status: ${error.status}, ${error.message}`);
      socket.disconnect();
    }
  }
}
