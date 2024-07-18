import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const logger = new Logger('Bootstrap');

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`App running on port: ${port}`);
  });
}
bootstrap();
