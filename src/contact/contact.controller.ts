import { Controller, Get, Body, Put, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactService } from './contact.service';
import { GetUser } from '@common/decorators/get-user.decorator';
import { Auth } from '@auth/decorators/auth.decorator';
import { GetContactsDto } from './dto/get-contact.dto';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Auth()
  getContacts(@GetUser() user: User, @Body() getContactsDto: GetContactsDto) {
    return this.contactService.getContacts(user, getContactsDto);
  }

  @Put()
  @Auth()
  update(@GetUser() user: User, @Body() createContactDto: CreateContactDto) {
    return this.contactService.update(user, createContactDto);
  }
}
