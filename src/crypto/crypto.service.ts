import { Injectable } from '@nestjs/common';
import { CryptoDto } from './dto/crypto.dto';

@Injectable()
export class CryptoService {
  getKeys(createCryptoDto: CryptoDto) {
    console.time('crypto');
    const { N, T, D, SEED } = createCryptoDto;

    const TID = SEED + (T - 1);
    const dni = TID / Math.pow(10, 14);
    let x = 0.444666 + dni;
    const r = 3.611 + dni * Math.pow(10, 3);
    const Mk2 = [];

    for (let n = 0; n < N; n++) {
      x = r * x * (1 - x);
      let acuy = 0;
      const k2 = [];

      for (let c = 1; c <= D; c++) {
        const y = Math.floor(x * Math.pow(10, c)) - acuy * 10;
        acuy += y;
        k2[c - 1] = +y.toString()[0] % 2;
      }

      Mk2[n] = k2;
    }
    console.timeEnd('crypto');
    return { Mk2 };
  }
}
