import { OneSignalService } from '@common/services/onesignal.service';
import { PrismaService } from '@common/services/prisma.service';
import { UtilsService } from '@common/services/utils.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
@Injectable()
export class CallService {
  @WebSocketServer() server: Server;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly onesignalService: OneSignalService,
  ) {}

  // CALL CREATE AND JOIN METHODS

  async handleCreateCall(client: Socket, payload: any): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.targetId },
    });

    if (user.oneSignalId) {
      try {
        this.onesignalService.sendCallNotification({
          title: user.username,
          userOneSignalId: user.oneSignalId,
        });
      } catch (error) {
        console.log('err', JSON.stringify(error));
      }
    }

    // Create call
    const session = await this.getSessionWithUser(client);
    const call = await this.prismaService.call.create({
      data: {
        UserCall: {
          createMany: {
            data: {
              sessionId: session.id,
              isActive: true,
            },
          },
        },
      },
    });

    // Send call invite
    const targets = await this.prismaService.session.findMany({
      select: { socketId: true },
      where: { userId: payload.targetId },
    });
    targets.map((target) => {
      this.server.to(target.socketId).emit('recive-call', {
        // members: [session.user],
        members: this.utilsService.addBaseUrlToAvatar([session.user]),
        callId: call.id,
      });
    });
    this.server.to(client.id).emit('created-call', call.id);
  }

  async handleAcceptCall(client: Socket, payload: any): Promise<void> {
    const session = await this.getSession(client);
    await this.prismaService.call.update({
      where: { id: payload.callId },
      data: {
        UserCall: {
          createMany: {
            data: {
              sessionId: session.id,
              isActive: true,
            },
          },
        },
      },
    });
  }

  // CALL INTERNAL METHODS

  async handleOffer(client: Socket, payload: any): Promise<void> {
    const socketIds = await this.getCallSocketIds(client);
    socketIds.map((socketId) =>
      this.server.to(socketId).emit('offer', payload.offer),
    );
  }

  async handleAnswer(client: Socket, payload: any): Promise<void> {
    const socketIds = await this.getCallSocketIds(client);
    socketIds.map((socketId) =>
      this.server.to(socketId).emit('answer', payload),
    );
  }

  async handleCandidate(client: Socket, payload: any): Promise<void> {
    const socketIds = await this.getCallSocketIds(client);
    socketIds.map((socketId) =>
      this.server.to(socketId).emit('candidate', payload),
    );
  }

  async handleHangUp(client: Socket): Promise<void> {
    const socketIds = await this.getCallSocketIds(client);
    await this.prismaService.userCall.updateMany({
      where: {
        session: {
          socketId: {
            in: socketIds,
          },
        },
      },
      data: {
        isActive: false,
      },
    });
    socketIds.map((socketId) => this.server.to(socketId).emit('hangup-server'));
  }

  // PRIVATE HANDLERS

  private async getSession(client: Socket) {
    return await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: client.id },
    });
  }

  private async getSessionWithUser(client: Socket) {
    return await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: client.id },
      include: {
        user: true,
      },
    });
  }

  private async getCallSocketIds(client: Socket) {
    const data = await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: client.id },
      include: {
        UserCall: {
          include: {
            call: {
              include: {
                UserCall: {
                  include: {
                    session: true,
                  },
                  where: {
                    isActive: true,
                  },
                },
              },
            },
          },
          where: {
            isActive: true,
          },
        },
      },
    });
    if (!data.UserCall.length) return [];
    const socketIds = data.UserCall[0].call.UserCall.map(
      (userCall) => userCall.session.socketId,
    );
    return socketIds.filter((socketId) => socketId !== client.id);
  }

  //Empty calls cleaner
  //Every minute
  @Cron('*/30 * * * * *')
  async cleanCalls() {
    await this.prismaService.userCall.updateMany({
      where: { session: { deletedAt: { not: null } } },
      data: {
        isActive: false,
      },
    });
  }
}
