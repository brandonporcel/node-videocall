import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat, User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { SearchDto } from './dto/search.dto';
import { UtilsService } from '@common/services/utils.service';
import { ChatsDto } from './dto/chats.dto';
@WebSocketGateway({ cors: true })
@Injectable()
export class ChatsService {
  @WebSocketServer() server: Server;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  async getChats(user: User, chatsDto: ChatsDto) {
    const chats = await this.prismaService.chat.findMany({
      where: {
        UserChat: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        UserChat: true,
      },
    });

    const noMeChatsPromises = chats.map(async (chat) => {
      return this.prismaService.chat.findUnique({
        where: { id: chat.id },
        select: {
          id: true,
          name: true,
          UserChat: {
            where: {
              userId: { not: user.id },
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

    const contactsMap = new Map();
    chatsDto.contacts.forEach((contact) => {
      contactsMap.set(contact.phoneNumber, contact.display);
    });

    noMeChats.forEach((chat) => {
      chat.UserChat = chat.UserChat.map((userChat) => {
        const contactDisplayName = contactsMap.get(userChat.User.phoneNumber);
        return {
          ...userChat,
          User: {
            ...userChat.User,
            ...this.utilsService.addBaseUrlToAvatar([userChat.User])[0],
            username: contactDisplayName || userChat.User.username,
          },
        };
      });
    });

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
        senderId: payload.senderId,
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

  private async getChat(payload: any) {
    const { members, chatId } = payload;
    if (members.length !== 2 && members.length !== 1) {
      throw new Error('Invalid number of members');
    }

    if (!chatId && members.length === 2) {
      const userIds = members.map((m: any) => m.id);
      const matchingUsers = await this.prismaService.userChat.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });
      if (matchingUsers.length === 2) {
        const [user1, user2] = matchingUsers;
        if (user1.chatId === user2.chatId) {
          return this.prismaService.chat.findUnique({
            where: {
              id: user1.chatId,
            },
          });
        }
      }

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
