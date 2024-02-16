import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, type Timesheet } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('timesheets')
@ApiTags('Hojas de tiempo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
export class TimesheetsController {
  public constructor(private readonly timesheetsService: TimesheetsService) {}

  @Post()
  public async create(
    @Body() createTimesheetDto: CreateTimesheetDto,
  ): Promise<Timesheet> {
    return this.timesheetsService.create(createTimesheetDto);
  }
}
