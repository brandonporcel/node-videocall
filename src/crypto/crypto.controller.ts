import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { CryptoDto } from './dto/crypto.dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('')
  @ApiExcludeEndpoint()
  getKeys(@Body() a: CryptoDto) {
    console.log(a);
    return this.cryptoService.getKeys(a);
  }
}
