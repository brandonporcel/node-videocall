import { Module } from '@nestjs/common';
import { P2pModule } from './p2p/p2p.module';

@Module({
  imports: [P2pModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
