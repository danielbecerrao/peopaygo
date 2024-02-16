import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateTimesheetDto,
  TimesheetDetailDto,
} from './dto/create-timesheet.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import type { ExtendedPrismaClient } from '../prisma.extension';
import type { Client, Timesheet } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { EmployeesService } from '../employees/employees.service';
import type { EmployeeeWithPaymentTypes } from '../common/types/types';

@Injectable()
export class TimesheetsService {
  public constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
    private readonly clientsService: ClientsService,
    private readonly employeesService: EmployeesService,
  ) {}

  private async validate(
    timesheetDetails: TimesheetDetailDto[],
  ): Promise<void> {
    const errors: string[] = [];
    for await (const timesheetDetail of timesheetDetails) {
      const employee: EmployeeeWithPaymentTypes =
        await this.employeesService.findOneById(timesheetDetail.employeeId);
      if (
        employee.paymentType.name === 'SALARY' &&
        timesheetDetail.hoursWorked
      ) {
        errors.push(
          `El empleado con documento ${employee.document} esta con salario y se estan registrando horas`,
        );
      }
      if (
        employee.paymentType.name === 'SALARY' &&
        timesheetDetail.grossSalary < employee.paymentType.amount
      ) {
        errors.push(
          `El empleado con documento ${employee.document} esta con salario y el salario minimo es: ${employee.paymentType.amount}`,
        );
      }
      if (
        employee.paymentType.name === 'HOURLY' &&
        timesheetDetail.hourlyRate < employee.paymentType.amount
      ) {
        errors.push(
          `El empleado con documento ${employee.document} esta por horas y el salario minimo es: ${employee.paymentType.amount}`,
        );
      }
      if (
        employee.paymentType.name === 'HOURLY' &&
        timesheetDetail.hourlyRate * employee.paymentType.amount !==
          timesheetDetail.grossSalary
      ) {
        errors.push(
          `A el empleado con documento ${employee.document} no le concuerda el salario reportado`,
        );
      }
    }
    if (errors.length > 0) {
      throw new BadRequestException('Error al crear timesheet', {
        description: errors.join('\n'),
      });
    }
  }

  public async create(
    createTimesheetDto: CreateTimesheetDto,
  ): Promise<Timesheet> {
    const client: Client | null = await this.clientsService.findOneById(
      createTimesheetDto.clientId,
    );
    if (!client) {
      throw new NotFoundException('Error al crear timesheet', {
        description: `No existe el cliente asociado`,
      });
    }
    await this.validate(createTimesheetDto.timesheetDetails);
    return this.prisma.client.timesheet.create({
      data: {
        clientId: createTimesheetDto.clientId,
        chequeDate: new Date(createTimesheetDto.chequeDate),
        submissionDate: new Date(createTimesheetDto.submissionDate),
        timesheetDetails: {
          create: createTimesheetDto.timesheetDetails,
        },
      },
    });
  }
}
