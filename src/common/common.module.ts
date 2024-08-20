import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { CommonGateway } from './common.gateway';
import { WebSocketService } from './services/web-socket.service';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@config/users.module';
import { UtilsService } from './services/utils.service';
import { OneSignalService } from './services/onesignal.service';

@Global()
@Module({
  imports: [AuthModule, UsersModule],
  providers: [
    PrismaService,
    WebSocketService,
    CommonGateway,
    UtilsService,
    OneSignalService,
  ],
  exports: [PrismaService, UtilsService, OneSignalService],
})
export class CommonModule {}
