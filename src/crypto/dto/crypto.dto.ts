import { ApiProperty } from '@nestjs/swagger';

export class CryptoDto {
  @ApiProperty()
  N: number;

  @ApiProperty()
  T: number;

  @ApiProperty()
  D: number;

  @ApiProperty()
  SEED: number;
}
