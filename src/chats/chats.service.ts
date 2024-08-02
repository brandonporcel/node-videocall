import { PrismaService } from '@common/services/prisma.service';
import { UsersService } from '@config/users.service';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class ChatsService {
  @WebSocketServer() server: Server;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  // SEND MESSAGES METHODS

  async handleSendMessage(client: Socket, payload: any) {
    //     const chat = await this.getChat(payload.chatId);
    //     const session =await this.getSession(client)
    //     // const user = await this.userService.userOrThrow({where})
    //     await this.prismaService.message.create({
    //       data: {
    //         content: payload.message,
    //         chatId: chat.id,
    //         senderId: session.userId,
    //         recivedAt: new Date(),
    //         readedAt: null,
    //       },
    //     });
    //     // chat.members
    //     const members=....[]
    // members.map(el=>{
    //   if(el.userid!==yo){
    //     this.server.to().emit('receive-message', { message: payload.message });
    //   }
    // })
  }

  async handleReceiveMessage(client: Socket, payload: any) {
    const messages = await this.getUnReadMessages(client);

    for (const message of messages) {
      await this.prismaService.message.update({
        where: { id: message.id },
        data: { readedAt: new Date() },
      });

      this.server.to(client.id).emit('update-read-at', { message });
    }
  }

  private async getChat(payload: any) {
    return await this.prismaService.chat.upsert({
      where: {
        id: payload.chatId,
      },
      update: {},
      create: {
        // ...
      },
    });

    // return await this.prismaService.chat.findUniqueOrThrow({
    //   where: { id: client.id },
    // });
  }

  private async getUnReadMessages(client: Socket) {
    return await this.prismaService.message.findMany({
      where: {
        recivedAt: client.id,
        readedAt: null,
      },
    });
  }

  private async getSession(client: Socket) {
    return await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: client.id },
    });
  }
}
