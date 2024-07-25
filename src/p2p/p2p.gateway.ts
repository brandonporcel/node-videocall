import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class P2pGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: any): void {
    client.broadcast.emit('offer', payload.offer);
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, payload: any): void {
    client.broadcast.emit('answer', payload);
  }

  @SubscribeMessage('candidate')
  handleCandidate(client: Socket, payload: any): void {
    client.broadcast.emit('candidate', payload);
  }

  @SubscribeMessage('hangup')
  handleHangUp(client: Socket): void {
    client.broadcast.emit('hangup');
  }
}
