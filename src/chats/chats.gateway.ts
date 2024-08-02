import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: true })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('send-message')
  handleMessage(client: Socket, payload: any) {
    this.chatsService.handleSendMessage(client, payload);
  }

  @SubscribeMessage('receive-message')
  handleReceiveMessage(client: Socket, payload: any) {
    this.chatsService.handleReceiveMessage(client, payload);
  }
}
