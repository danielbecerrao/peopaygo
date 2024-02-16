import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const applyDeletedAtCondition = (args) => {
  const where = args.where ?? {};
  where.deletedAt = null;
  args.where = where;
  return args;
};

export const extendedPrismaClient = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        const salt: string = await bcrypt.genSalt();
        args.data.password = await bcrypt.hash(args.data.password, salt);
        args.data.salt = salt;
        return query(args);
      },
    },
    $allModels: {
      async findUnique({ args, query }) {
        args = applyDeletedAtCondition(args);
        return query(args);
      },
      async findFirst({ args, query }) {
        args = applyDeletedAtCondition(args);
        return query(args);
      },
      async findMany({ args, query }) {
        args = applyDeletedAtCondition(args);
        return query(args);
      },
    },
  },
  model: {
    $allModels: {
      async softDelete(id: string) {
        return extendedPrismaClient.user.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

export type ExtendedPrismaClient = typeof extendedPrismaClient;
