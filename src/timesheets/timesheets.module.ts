import { Module } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { TimesheetsController } from './timesheets.controller';
import { ClientsModule } from '../clients/clients.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [ClientsModule, EmployeesModule],
  controllers: [TimesheetsController],
  providers: [TimesheetsService],
})
export class TimesheetsModule {}
