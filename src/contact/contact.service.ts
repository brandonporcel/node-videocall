import { Injectable } from '@nestjs/common';
import { ChatType, User } from '@prisma/client';
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

    let matchingUsers = await this.prismaService.user.findMany({
      where: {
        phoneNumber: {
          in: phoneNumbers,
        },
      },
      include: {
        UserChat: {
          include: {
            Chat: {
              include: {
                UserChat: {
                  where: {
                    userId: {
                      not: user.id,
                    },
                  },
                  include: { User: true },
                },
                Message: {
                  take: 50,
                },
              },
            },
          },
          where: {
            Chat: {
              type: ChatType.direct,
              UserChat: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    });
    matchingUsers.forEach((user) => {
      if (user.UserChat.length) {
        user.UserChat[0].Chat.name = user.username;
      }
    });

    const contactsMap = new Map();
    getContactsDto.contacts.forEach((contact) => {
      contactsMap.set(contact.phoneNumber, contact.display);
    });

    matchingUsers = matchingUsers
      .filter(({ phoneNumber }) => phoneNumber !== user.phoneNumber)
      .map((user) => {
        const contactDisplayName = contactsMap.get(user.phoneNumber);
        return {
          ...user,
          username: contactDisplayName || user.username,
        };
      });

    matchingUsers = this.utilsService.addBaseUrlToAvatar(matchingUsers);

    return {
      filtered: matchingUsers,
      usersForInvite: getContactsDto.contacts.filter(
        (el) =>
          !matchingUsers.some((mU) => mU.phoneNumber === el.phoneNumber) &&
          el.phoneNumber !== user.phoneNumber,
      ),
    };
  }
}
