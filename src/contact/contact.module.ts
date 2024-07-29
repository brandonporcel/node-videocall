import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { UsersModule } from '@config/users.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
