import { Inject, Injectable } from '@nestjs/common';
import type { PaymentType } from '@prisma/client';
import { CustomPrismaService } from 'nestjs-prisma';
import type { ExtendedPrismaClient } from '../prisma.extension';

@Injectable()
export class PaymentTypesService {
  public constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  public async findAll(): Promise<PaymentType[]> {
    return this.prisma.client.paymentType.findMany();
  }

  public async findOneById(id: string): Promise<PaymentType | null> {
    return this.prisma.client.paymentType.findUnique({
      where: {
        id,
      },
    });
  }
}
