import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketService } from './services/web-socket.service';

@WebSocketGateway({ cors: true })
export class CommonGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('Web socket');

  constructor(private readonly webSocketService: WebSocketService) {}

  afterInit(server: Server) {
    this.logger.log('Init', server);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    this.webSocketService.onConnect(
      client,
      client.handshake.headers.authorization,
    );
  }

  handleDisconnect(client: Socket) {
    this.webSocketService.onDisconnect(client);
  }
}
