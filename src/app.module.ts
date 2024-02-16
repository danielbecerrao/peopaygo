import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';
import { extendedPrismaClient } from './prisma.extension';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeesModule } from './employees/employees.module';
import { TimesheetsModule } from './timesheets/timesheets.module';
import { ClientsModule } from './clients/clients.module';
import { PaymentTypesModule } from './payment-types/payment-types.module';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    EmployeesModule,
    TimesheetsModule,
    ClientsModule,
    PaymentTypesModule,
  ],
})
export class AppModule {}
