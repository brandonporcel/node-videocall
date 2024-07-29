import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  logger = new Logger('PrismaService');

  async onModuleInit() {
    this.useSoftDelete();
    this.logging();
    await this.$connect();
  }

  useSoftDelete() {
    /***********************************/
    /* SOFT DELETE MIDDLEWARE */
    /***********************************/

    this.$use(async (params, next) => {
      const deletedKeyWords = ['deletedAt', 'deleted_at'];
      const hasSoftDelete = Prisma.dmmf.datamodel.models
        .find((model) => model.name === params.model)
        .fields.some((field) => deletedKeyWords.includes(field.name));
      if (hasSoftDelete) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deletedAt'] = null;
        } else if (
          params.action === 'findFirstOrThrow' ||
          params.action === 'findUniqueOrThrow'
        ) {
          if (params.args.where) {
            if (params.args.where.deletedAt == undefined) {
              params.args.where['deletedAt'] = null;
            }
          } else {
            params.args['where'] = { deletedAt: null };
          }
        } else if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deletedAt == undefined) {
              params.args.where['deletedAt'] = null;
            }
          } else {
            params.args['where'] = { deletedAt: null };
          }
        } else if (params.action == 'update') {
          params.action = 'updateMany';
          params.args.where['deletedAt'] = null;
        } else if (params.action == 'updateMany') {
          if (params.args.where != undefined) {
            params.args.where['deletedAt'] = null;
          } else {
            params.args['where'] = { deletedAt: null };
          }
        } else if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deletedAt: true };
        } else if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = new Date();
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
      }
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
