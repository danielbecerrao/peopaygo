import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from 'nestjs-prisma';
import { ClientsService } from '../clients/clients.service';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let clientService: ClientsService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeesService, ClientsService, PrismaService],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    clientService = module.get<ClientsService>(ClientsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
