import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @IsString()
  public clientId!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public submissionDate!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  public chequeDate!: Date;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => TimesheetDetailDto)
  @ValidateNested({ each: true })
  public timesheetDetails!: TimesheetDetailDto[];
}

export class TimesheetDetailDto {
  @IsNotEmpty()
  @IsString()
  public employeeId!: string;

  @IsOptional()
  @IsNumber()
  public hourlyRate!: number;

  @IsOptional()
  @IsNumber()
  public hoursWorked!: number;

  @IsOptional()
  @IsNumber()
  public grossSalary!: number;
}
