import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat, User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { SearchDto } from './dto/search.dto';
@WebSocketGateway({ cors: true })
@Injectable()
export class ChatsService {
  @WebSocketServer() server: Server;

  constructor(private readonly prismaService: PrismaService) {}

  async getChats(user: User) {
    const chats = await this.prismaService.chat.findMany({
      select: {
        id: true,
        UserChat: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    const noMeChatsPromises = chats.map(async (chat) => {
      return this.prismaService.chat.findMany({
        select: {
          id: true,
          name: true,
          UserChat: {
            where: {
              userId: {
                not: user.id,
              },
              chatId: chat.id,
            },
            select: {
              User: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  avatarUrl: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });
    });

    const noMeChatsArray = await Promise.all(noMeChatsPromises);
    const noMeChats = noMeChatsArray.flat();

    return noMeChats;
  }

  async getChatHistorial(chatId: string) {
    return await this.prismaService.message.findMany({
      where: { chatId },
      take: 50,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // SEND MESSAGES METHODS
  async handleSendMessage(client: Socket, payload: any) {
    const members = payload.members;
    const chat = await this.getChat(payload);
    const session = await this.getSession(client);

    await this.handleUserChats(chat, members);
    const message = await this.prismaService.message.create({
      data: {
        content: payload.message,
        chatId: chat.id,
        senderId: session.userId,
        receivedAt: new Date(),
        readedAt: null,
      },
    });

    const targets = await this.prismaService.session.findMany({
      select: { socketId: true },
      where: { userId: members[0].id },
    });
    targets.map((target) => {
      this.server.to(target.socketId).emit('receive-message', message);
    });
  }

  private async handleUserChats(chat: Chat, members: User[]) {
    const userChats = await this.prismaService.userChat.findMany({
      where: { chatId: chat.id },
    });
    if (userChats.length !== 0) return;

    members.map(async (user) => {
      await this.prismaService.userChat.create({
        data: {
          userId: user.id,
          chatId: chat.id,
        },
      });
    });
  }

  async handleReceiveMessage(client: Socket, payload: any) {
    const messages = await this.getUnReadMessages(client);

    await this.prismaService.message.update({
      where: { id: payload.message.id },
      data: { readedAt: new Date() },
    });
    // this.server.to(client.id).emit('update-read-at', { payload });
  }

  private async getChat(payload: any, withMembers = false) {
    const { members, chatId } = payload;
    if (members.length !== 2 && members.length !== 1) {
      throw new Error('Invalid number of members');
    }

    if (!chatId && members.length === 2) {
      return this.prismaService.chat.create({
        data: {
          name: null,
        },
      });
    }
    return this.prismaService.chat.findUnique({
      where: {
        id: chatId,
      },
    });
  }

  private async getUserChat(chatId: string) {}

  private async getUnReadMessages(client: Socket) {
    return await this.prismaService.message.findMany({
      where: {
        readedAt: null,
      },
    });
  }

  private async getSession(client: Socket) {
    return await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: client.id },
    });
  }

  async search({ query, contacts }: SearchDto) {
    const contactz = ['+54 9 11 444 5555'];

    const x: any = {
      filtered: [],
      usersWithAccount: [],
    };

    const matchingUsers = await this.prismaService.user.findMany({
      where: {
        phoneNumber: {
          in: contactz,
        },
      },
    });

    x.filtered = matchingUsers;
    x.usersWithAccount = matchingUsers;
    return x;
  }
}
