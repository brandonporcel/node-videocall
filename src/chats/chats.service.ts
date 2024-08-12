import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Chat, User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { SearchDto } from './dto/search.dto';
import { UtilsService } from '@common/services/utils.service';
import { ChatsDto } from './dto/chats.dto';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({ cors: true })
export class ChatsService {
  @WebSocketServer() server: Server;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  async getChats(user: User, chatsDto: ChatsDto) {
    const chats = await this.prismaService.chat.findMany({
      include: {
        UserChat: {
          where: {
            userId: { not: user.id },
          },
          include: {
            User: true,
          },
        },
        Message: {
          take: 50,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      where: {
        UserChat: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    const contactsMap = new Map();
    chatsDto.contacts.forEach((contact) => {
      contactsMap.set(contact.phoneNumber, contact.display);
    });

    const parsedChats = chats.map((chat) => ({
      ...chat,
      UserChat: chat.UserChat.map((userChat) => ({
        ...userChat,
        User: {
          ...this.utilsService.addBaseUrlToAvatar([userChat.User])[0],
          username:
            contactsMap.get(userChat.User.phoneNumber) ||
            userChat.User.username,
        },
      })),
    }));

    return parsedChats;
  }

  async getChat(fromId: string, toId: string) {
    return await this.prismaService.chat.findFirst({
      where: {
        UserChat: {
          every: {
            userId: {
              in: [fromId, toId],
            },
          },
        },
      },
      include: {
        UserChat: {
          where: {
            userId: { not: fromId },
          },
          include: {
            User: true,
          },
        },
        Message: {
          take: 50,
        },
      },
    });
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

  async handleSendMessage(
    client: Socket,
    payload: { to: string; message: string },
  ) {
    const sender = await this.getSession(client);
    const { isNew, chat } = await this.getOrCreateChat([
      sender.userId,
      payload.to,
    ]);
    const message = await this.prismaService.message.create({
      data: {
        content: payload.message,
        chatId: chat.id,
        senderId: sender.userId,
        receivedAt: new Date(),
        readedAt: null,
      },
    });
    const targets = await this.prismaService.session.findMany({
      select: { socketId: true },
      where: { userId: { in: [payload.to, sender.userId] } },
    });

    targets.map((target) => {
      this.server
        .to(target.socketId)
        .emit(`receive-message/${chat.id}`, message);
    });

    if (isNew) {
      this.server.to(client.id).emit('chat-created');
    }
  }

  private async getOrCreateChat(userIds: string[]) {
    const chat = await this.getChat(userIds[0], userIds[1]);
    if (chat) return { isNew: false, chat };
    const newChat = await this.prismaService.chat.create({
      data: {
        UserChat: {
          createMany: {
            data: userIds.map((userId) => ({ userId })),
          },
        },
      },
      include: {
        UserChat: true,
      },
    });
    return { isNew: true, chat: newChat };
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
