import { Module } from '@nestjs/common';
import { CallGateway } from './call.gateway';
import { CallService } from './call.service';
import { CallController } from './call.controller';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@config/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [CallGateway, CallService],
  controllers: [CallController],
})
export class CallModule {}
