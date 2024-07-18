import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { P2pModule } from './p2p/p2p.module';
import appConfig from './config/app.config';
import validateConfig from './config/validate.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: validateConfig,
    }),
    P2pModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
