import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TimesheetsService } from './timesheets.service';

describe.skip('TimesheetsService', () => {
  let service: TimesheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimesheetsService],
    }).compile();

    service = module.get<TimesheetsService>(TimesheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
