import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  username: string;
}
