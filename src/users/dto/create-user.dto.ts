import { Role } from '@prisma/client';
import type { ValidationOptions, ValidationArguments } from 'class-validator';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  registerDecorator,
} from 'class-validator';

export function IsCompanyRequired(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string): void {
    registerDecorator({
      name: 'sCompanyRequired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: string | undefined,
          args: ValidationArguments,
        ): boolean {
          const role = args.object['role'];
          if (
            (role === 'CLIENT' &&
              value !== undefined &&
              typeof value === 'string') ||
            role === 'ADMIN'
          )
            return true;
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser texto y es obligatorio solo cuando el role es CLIENT.`;
        },
      },
    });
  };
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  public password!: string;

  @IsEnum(Role)
  @IsOptional()
  public role!: Role;

  @IsCompanyRequired()
  public clientName!: string;
}
