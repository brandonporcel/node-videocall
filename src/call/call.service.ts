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
      include: {
        Sessions: {
          include: {
            UserCall: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (
      user.Sessions.map((x) => x.UserCall.some((y) => y.isActive)).some(
        (x) => x,
      )
    ) {
      this.server
        .to(client.id)
        .emit('created-call-error', 'El usuario está ocupado');
      return;
    }
    if (!user.Sessions.length && !user.oneSignalId) {
      this.server
        .to(client.id)
        .emit('created-call-error', 'El usuario no se encuentra disponible');
      return;
    }

    // Create call
    const session = await this.getSessionWithUser(client);
    const call = await this.prismaService.call.create({
      data: {
        UserCall: {
          createMany: {
            data: [
              {
                sessionId: session.id,
                isActive: true,
              },
              ...user.Sessions.map((session) => ({
                sessionId: session.id,
                isActive: false,
              })),
            ],
          },
        },
      },
    });

    if (user.oneSignalId) {
      try {
        const resp = await this.onesignalService.sendCallNotification({
          title: session.user.username,
          phoneNumber: session.user.phoneNumber,
          userOneSignalId: user.oneSignalId,
          callId: call.id,
        });
        console.log({ resp });
        await this.prismaService.userCall.updateMany({
          where: { callId: call.id, session: { socketId: { not: client.id } } },
          data: { notificationId: resp.id },
        });
      } catch (error) {
        console.log('err', JSON.stringify(error));
      }
    }

    // Send call invite
    const targets = user.Sessions;
    targets.map((target) => {
      this.server.to(target.socketId).emit('recive-call', {
        members: this.utilsService.addBaseUrlToAvatar([session.user]),
        callId: call.id,
      });
    });
    this.server.to(client.id).emit('created-call', call.id);
  }

  async getUserCallByCallId(callId: string) {
    return await this.prismaService.userCall.findFirstOrThrow({
      where: {
        callId: callId
      }
    })
  }

  async handleAcceptCall(client: Socket, payload: any): Promise<void> {
    const session = await this.getSession(client);
    const userCall = await this.prismaService.userCall.findFirst({
      where: {
        callId: payload.callId as string,
        sessionId: session.id,
      },
    });
    if (userCall) {
      await this.prismaService.userCall.update({
        where: { id: userCall.id },
        data: { isActive: true },
      });
    } else {
      await this.prismaService.userCall.create({
        data: { callId: payload.callId, sessionId: session.id },
      });
    }
  }

  async handleRejectCall(client: Socket, payload: any): Promise<void> {
    const call = await this.prismaService.call.findUnique({
      where: { id: payload.callId },
      include: {
        UserCall: {
          include: {
            session: {
              select: {
                socketId: true,
              },
            },
          },
        },
      },
    });
    await this.prismaService.userCall.updateMany({
      where: {
        callId: payload.callId,
      },
      data: {
        isActive: false,
      },
    });
    call.UserCall.map((userCall) =>
      this.server.emit('call-rejected', userCall.session.socketId),
    );
  }

  // CALL INTERNAL METHODS

  async handleStreamCall(client: Socket, payload: any): Promise<void> {
    const socketIds = await this.getCallSocketIds(client);
    socketIds.map((socketId) =>
      this.server.to(socketId).emit('remote-controls', payload),
    );
  }

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
    await this.removeCall(client.id);
    await this.prismaService.userCall.updateMany({
      where: {
        session: {
          socketId: {
            in: [...socketIds, client.id],
          },
        },
      },
      data: {
        isActive: false,
      },
    });
    socketIds.map((socketId) => this.server.to(socketId).emit('hangup-server'));
    this.server.to(client.id).emit('hangup-server');
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

  private async removeCall(socketId: string) {
    const session = await this.prismaService.session.findUniqueOrThrow({
      where: { socketId: socketId },
      include: {
        UserCall: {
          where: {
            isActive: true,
          },
          include: {
            call: {
              include: {
                UserCall: {
                  include: {
                    session: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const call = session.UserCall[0].call;
    if (call) {
      const promises = call.UserCall.map(async (user) => {
        if (user.notificationId) {
          try {
            // await this.onesignalService.deleteNotification(user.notificationId);
          } catch (err) {
            console.log(err);
          }
        }
        this.server.to(user.session.socketId).emit(`call-deleted/${call.id}`);
      });
      await Promise.all(promises);
    }
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
