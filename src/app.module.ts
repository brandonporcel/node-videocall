import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallModule } from './call/call.module';
import { appConfig, databaseConfig, jwtConfig, validateConfig } from './config';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@common/common.module';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: validateConfig,
    }),
    AuthModule,
    CommonModule,
    UsersModule,
    CallModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
