import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: true })
export class ChatsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('send-direct-message')
  handleMessage(client: Socket, payload: any) {
    this.chatsService.handleSendMessage(client, payload);
  }

  @SubscribeMessage('receive-message')
  handleReceiveMessage(client: Socket, payload: any) {
    this.chatsService.handleReceiveMessage(client, payload);
  }

  @SubscribeMessage('sync-chat')
  syncChat(client: Socket, payload: any) {
    this.chatsService.syncChat(client, payload);
  }
}
