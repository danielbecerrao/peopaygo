import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { Role, type PaymentType } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('payment-types')
@ApiTags('Tipos de pago')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CLIENT)
export class PaymentTypesController {
  public constructor(
    private readonly paymentTypesService: PaymentTypesService,
  ) {}

  @Get()
  public async findAll(): Promise<PaymentType[]> {
    return this.paymentTypesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<PaymentType | null> {
    return this.paymentTypesService.findOneById(id);
  }
}
