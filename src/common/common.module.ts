import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { CommonGateway } from './common.gateway';
import { WebSocketService } from './services/web-socket.service';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@config/users.module';

@Global()
@Module({
  imports: [AuthModule, UsersModule],
  providers: [PrismaService, WebSocketService, CommonGateway],
  exports: [PrismaService],
})
export class CommonModule {}
