import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chats.controller';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@config/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [ChatsService, ChatsGateway],
  controllers: [ChatsController],
})
export class ChatsModule {}
