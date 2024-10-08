import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
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
    description: 'User password',
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

  @ApiProperty({
    description: 'User OneSignalId',
    example: 'da20618b-513e-4f09-976f-fd4735ca16eb',
    nullable: true,
  })
  @IsOptional()
  oneSignalId?: string;
}
