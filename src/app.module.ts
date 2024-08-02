import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { CallModule } from './call/call.module';
import { appConfig, databaseConfig, jwtConfig, validateConfig } from './config';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: validateConfig,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    UsersModule,
    CallModule,
    ContactModule,
    CryptoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
