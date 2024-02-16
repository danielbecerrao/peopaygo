import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { ExtendedPrismaClient } from '../prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import type { Client, Employee, PaymentType } from '@prisma/client';
import { ClientsService } from '../clients/clients.service';
import { PaymentTypesService } from '../payment-types/payment-types.service';
import type { EmployeeeWithPaymentTypes } from '../common/types/types';

@Injectable()
export class EmployeesService {
  public constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly clientService: ClientsService,
    private readonly paymentTypesService: PaymentTypesService,
  ) {}

  private async validate(
    dto: CreateEmployeeDto | UpdateEmployeeDto,
  ): Promise<void> {
    if (dto.clientId) {
      const client: Client | null = await this.clientService.findOneById(
        dto.clientId,
      );
      if (!client) {
        throw new NotFoundException('Error al crear empleado', {
          description: `No existe el cliente asociado`,
        });
      }
    }
    if (dto.paymentTypeId) {
      const paymentType: PaymentType | null =
        await this.paymentTypesService.findOneById(dto.paymentTypeId);
      if (!paymentType) {
        throw new NotFoundException('Error al crear empleado', {
          description: `No existe el tipo de pago asociado`,
        });
      }
    }
  }

  public async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    await this.validate(createEmployeeDto);
    const employee: Employee | null = await this.findOneByDocument(
      createEmployeeDto.document,
    );
    if (employee) {
      throw new BadRequestException('Error al crear empleado', {
        description: `Ya existe un empleado con este documento`,
      });
    }
    try {
      const newEmployee: Employee =
        await this.prismaService.client.employee.create({
          data: createEmployeeDto,
        });
      return newEmployee;
    } catch (error) {
      throw new BadRequestException('Error al crear empleado', {
        description: `Error: ${error}`,
      });
    }
  }

  public async findOneByDocument(document: string): Promise<Employee | null> {
    return this.prismaService.client.employee.findUnique({
      where: {
        document,
      },
    });
  }

  public async findAll(): Promise<Employee[]> {
    return this.prismaService.client.employee.findMany();
  }

  public async findOneById(id: string): Promise<EmployeeeWithPaymentTypes> {
    const employee: EmployeeeWithPaymentTypes | null =
      await this.prismaService.client.employee.findUnique({
        where: {
          id,
        },
        include: {
          paymentType: true,
        },
      });
    if (!employee) {
      throw new NotFoundException('Empleado no encontrado', {
        description: 'Error: Empleado no encontrado por Id',
      });
    }
    return employee;
  }

  public async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    await this.validate(updateEmployeeDto);
    const employee: Employee = await this.findOneById(id);
    if (
      updateEmployeeDto.document &&
      updateEmployeeDto.document !== employee.document
    ) {
      const employeeByDocument: Employee | null = await this.findOneByDocument(
        updateEmployeeDto.document,
      );
      if (employeeByDocument) {
        throw new BadRequestException('Error al actualizar empleado', {
          description: `Ya existe un empleado con este documento`,
        });
      }
    }
    try {
      const updatedEmployee: Employee =
        await this.prismaService.client.employee.update({
          data: updateEmployeeDto,
          where: {
            id,
          },
        });
      return updatedEmployee;
    } catch (error) {
      throw new BadRequestException('Error al editar empleado', {
        description: `Error: ${error}`,
      });
    }
  }

  public async remove(id: string): Promise<Employee> {
    await this.findOneById(id);
    try {
      const employee: Employee =
        await this.prismaService.client.employee.delete({
          where: {
            id,
          },
        });
      return employee;
    } catch (error) {
      throw new BadRequestException('Error al eliminar empleado', {
        description: `Error: ${error}`,
      });
    }
  }
}
