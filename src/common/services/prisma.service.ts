import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new Logger('PrismaService');

  async onModuleInit() {
    this.useSoftDelete();
    this.logging();
    await this.$connect();
  }

  useSoftDelete() {
    this.$use(async (params, next) => {
      // SOFT DELETES
      // if (params.model == 'Post') {
      //   if (params.action == 'delete') {
      //     // Delete queries
      //     // Change action to an update
      //     params.action = 'update';
      //     params.args['data'] = { deleted: new Date() };
      //   }
      //   if (params.action == 'deleteMany') {
      //     // Delete many queries
      //     params.action = 'updateMany';
      //     if (params.args.data != undefined) {
      //       params.args.data['deleted'] = new Date();
      //     } else {
      //       params.args['data'] = { deleted: new Date() };
      //     }
      //   }
      // }
      return next(params);
    });
  }

  logging() {
    this.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      this.logger.debug(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );

      return result;
    });
  }
}
