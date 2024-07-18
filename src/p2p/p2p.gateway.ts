import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class P2pGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('VideoGateway');

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: any): void {
    client.broadcast.emit('offer', payload);
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

  afterInit(server: Server) {
    this.logger.log('Init', server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}, ${JSON.stringify(args)}`);
  }
}
