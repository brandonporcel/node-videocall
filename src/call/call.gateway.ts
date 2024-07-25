import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CallService } from './call.service';

@WebSocketGateway({ cors: true })
export class CallGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly callService: CallService) {}

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: any): void {}

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
