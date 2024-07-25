import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class ContactDto {
  @IsNotEmpty()
  display: string;

  @IsNotEmpty()
  phoneNumber: string;
}

export class CreateContactDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
