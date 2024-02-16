import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ClientsModule } from '../clients/clients.module';
import { PaymentTypesModule } from '../payment-types/payment-types.module';

@Module({
  imports: [ClientsModule, PaymentTypesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
