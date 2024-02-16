import type { Prisma, User } from '@prisma/client';

export type UserWithoutSensitiveInfo = Omit<User, 'password' | 'salt'>;

export type EmployeeeWithPaymentTypes = Prisma.EmployeeGetPayload<{
  include: { paymentType: true };
}>;
