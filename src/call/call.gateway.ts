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

  @SubscribeMessage('create-call')
  async handleCreateCall(client: Socket, payload: any): Promise<void> {
    await this.callService.handleCreateCall(client, payload);
  }

  @SubscribeMessage('accept-call')
  async handleAcceptCall(client: Socket, payload: any): Promise<void> {
    await this.callService.handleAcceptCall(client, payload);
  }

  @SubscribeMessage('offer')
  async handleOffer(client: Socket, payload: any): Promise<void> {
    await this.callService.handleOffer(client, payload);
  }

  @SubscribeMessage('answer')
  async handleAnswer(client: Socket, payload: any): Promise<void> {
    await this.callService.handleAnswer(client, payload);
  }

  @SubscribeMessage('candidate')
  async handleCandidate(client: Socket, payload: any): Promise<void> {
    await this.callService.handleCandidate(client, payload);
  }

  @SubscribeMessage('hangup')
  async handleHangUp(client: Socket): Promise<void> {
    await this.callService.handleHangUp(client);
  }
}
