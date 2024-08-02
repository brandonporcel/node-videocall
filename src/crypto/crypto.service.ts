import { Injectable } from '@nestjs/common';
import { CryptoDto } from './dto/crypto.dto';
import Decimal from 'decimal.js';

@Injectable()
export class CryptoService {
  crypto(createCryptoDto: CryptoDto) {
    Decimal.config({ precision: 200 });
    const { N, T = 1, D, SEED } = createCryptoDto;

    const TID = new Decimal(SEED + (T - 1));
    const dni = TID.dividedBy(new Decimal(10).pow(14));
    let x = dni.plus(0.444666);
    const r = dni.mul(new Decimal(10).pow(3)).plus(3.611);
    const K2 = [];
    const Mk2 = [];

    for (let n = 0; n < N; n++) {
      x = r.mul(x).mul(x.minus(1));
      let acuy = new Decimal(0);
      let acuk = new Decimal(0);
      const k2 = [];

      for (let c = 1; c <= D; c++) {
        const a = new Decimal(10).pow(c);
        let y = x.mul(a);
        const y2 = y.floor();
        const y3 = acuy.mul(10);
        y = y2.minus(y3);
        acuy = acuy.plus(y);

        k2[c - 1] = +y.toString().split('.')[0] % 2 ? 0 : 1;
        console.log({ y, y2, y3 });
        acuk = acuk.plus(new Decimal(k2[c - 1]).mul(new Decimal(2).pow(c - 1)));
        console.log(acuk);
      }

      Mk2[n] = k2; // Matriz de claves en estado binario
      K2[n] = acuk; // Vector de claves donde c/u se expresa como un número entero
    }
    return { Mk2, K2 };
  }
}
