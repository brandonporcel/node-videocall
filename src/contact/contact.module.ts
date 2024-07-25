import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@config/users.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [CommonModule, AuthModule, forwardRef(() => UsersModule)],
})
export class ContactModule {}
