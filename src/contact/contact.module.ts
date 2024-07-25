import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CommonModule } from '@common/common.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [CommonModule],
})
export class ContactModule {}
