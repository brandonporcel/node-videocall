import { Controller, Body, Post, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { GetUser } from '@common/decorators/get-user.decorator';
import { Auth } from '@auth/decorators/auth.decorator';
import { GetContactsDto } from './dto/get-contact.dto';
import { TransformUserInterceptor } from '@auth/interceptors/user.interceptor';

@ApiTags('Contacts')
@Controller('contacts')
@UseInterceptors(TransformUserInterceptor)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Auth()
  getContacts(@GetUser() user: User, @Body() getContactsDto: GetContactsDto) {
    return this.contactService.getContacts(user, getContactsDto);
  }
}
