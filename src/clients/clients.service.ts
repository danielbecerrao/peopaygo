import { Inject, Injectable } from '@nestjs/common';
import type { Client } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import type { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class ClientsService {
  public constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  public async findOneById(id: string): Promise<Client | null> {
    return this.prisma.client.client.findUnique({
      where: {
        id,
      },
    });
  }
}
