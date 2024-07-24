import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@domain.com',
    nullable: false,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'The email is invalid',
  })
  email: string;

  @ApiProperty({
    description: 'username',
    example: 'John Doe',
    nullable: false,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+54 (123) 4567-8910',
    nullable: false,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  phoneNumber: string;

  @ApiProperty({
    description: 'User email',
    example: '1324asdF',
    nullable: false,
    minLength: 6,
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
