import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallModule } from './call/call.module';
import { appConfig, databaseConfig, jwtConfig, validateConfig } from './config';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
