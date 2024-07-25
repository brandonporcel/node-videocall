import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class CallService {
  @WebSocketServer() server: Server;

  handleOffer(client: Socket, payload: any): void {
    this.server.to('id').emit('recive-call');
    client.broadcast.emit('offer', payload.offer);
  }
}
