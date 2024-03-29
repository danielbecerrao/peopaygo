import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TimesheetsController } from './timesheets.controller';
import { TimesheetsService } from './timesheets.service';

describe.skip('TimesheetsController', () => {
  let controller: TimesheetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesheetsController],
      providers: [TimesheetsService],
    }).compile();

    controller = module.get<TimesheetsController>(TimesheetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
