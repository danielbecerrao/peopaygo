import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public document!: string;

  @IsNotEmpty()
  @IsString()
  public paymentTypeId!: string;

  @IsNotEmpty()
  @IsString()
  public clientId!: string;
}
