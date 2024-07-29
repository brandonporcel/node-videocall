import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { UsersService } from '@config/users.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
@Injectable()
export class WebSocketService {
  @WebSocketServer() server: Server;
  logger = new Logger('WebSocketService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async onConnect(socket: Socket, token?: string) {
    try {
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get('jwt.secret'),
      });

      const user = await this.usersService.authUser(payload.id);
      if (!user) throw new BadRequestException('User not found');

      await this.prismaService.session.create({
        data: { userId: user.id, socketId: socket.id },
      });

      return true;
    } catch (error) {
      this.logger.error(token, error);
      socket.disconnect();
    }
  }

  async onDisconnect(socket: Socket) {
    return this.prismaService.session.deleteMany({
      where: { socketId: socket.id },
    });
  }

  //Every minute
  @Cron('0 * * * * *')
  async updateConnections() {
    const connectedClients = Array.from(this.server.sockets.sockets.keys());
    await this.prismaService.session.deleteMany({
      where: { socketId: { notIn: connectedClients } },
    });
  }
}
