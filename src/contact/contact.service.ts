import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { GetContactsDto } from './dto/get-contact.dto';
import { UtilsService } from '@common/services/utils.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  async getContacts(user: User, getContactsDto: GetContactsDto) {
    const phoneNumbers = getContactsDto.contacts.map(
      (contact) => contact.phoneNumber,
    );

    const x: any = {
      filtered: [],
      usersForInvite: [],
      usersWithAlreadyChat: [],
    };

    const matchingUsers = await this.prismaService.user.findMany({
      where: {
        phoneNumber: {
          in: phoneNumbers,
        },
      },
    });

    const contactsMap = new Map();
    getContactsDto.contacts.forEach((contact) => {
      contactsMap.set(contact.phoneNumber, contact.display);
    });

    x.filtered = matchingUsers
      .filter(({ phoneNumber }) => phoneNumber !== user.phoneNumber)
      .map((user) => {
        const contactDisplayName = contactsMap.get(user.phoneNumber);
        return {
          ...user,
          username: contactDisplayName || user.username,
        };
      });

    x.filtered = this.utilsService.addBaseUrlToAvatar(x.filtered);

    const matchingPhoneNumbers = new Set(
      matchingUsers.map(({ phoneNumber }) => phoneNumber),
    );
    x.usersForInvite = getContactsDto.contacts
      .filter((contact) => !matchingPhoneNumbers.has(contact.phoneNumber))
      .map((contact) => ({
        display: contact.display,
        phoneNumber: contact.phoneNumber,
      }));

    return x;
  }
}
