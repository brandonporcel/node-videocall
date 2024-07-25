export class ContactDto {
  display: string;
  phoneNumber: string;
}

export interface CreateContactDto {
  contacts: ContactDto[];
}
