import { forwardRef, Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CommonModule } from '@common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@config/users.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [CommonModule, JwtModule, forwardRef(() => UsersModule)],
})
export class ContactModule {}
