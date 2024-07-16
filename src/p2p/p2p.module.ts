import { Module } from '@nestjs/common';
import { P2pGateway } from './p2p.gateway';

@Module({
  providers: [P2pGateway],
})
export class P2pModule {}
