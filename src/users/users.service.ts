import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { User } from '@prisma/client';
import type { ExtendedPrismaClient } from '../prisma.extension';
import type { UserWithoutSensitiveInfo } from '../common/types/types';

@Injectable()
export class UsersService {
  public constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    password: false,
    salt: false,
    client: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  };

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<UserWithoutSensitiveInfo> {
    const user: User | null = await this.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Error al crear usuario', {
        description: `Ya existe un usuario con este email`,
      });
    }
    let client = {};
    if (createUserDto.role === 'CLIENT') {
      client = {
        create: { name: createUserDto.clientName },
      };
    }
    try {
      const newUser: UserWithoutSensitiveInfo =
        await this.prisma.client.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            role: createUserDto.role,
            salt: '',
            client,
          },
          select: this.userSelect,
        });
      return newUser;
    } catch (error) {
      throw new BadRequestException('Error al crear usuario', {
        description: `Error: ${error}`,
      });
    }
  }

  public async findAll(): Promise<UserWithoutSensitiveInfo[]> {
    return this.prisma.client.user.findMany({
      select: this.userSelect,
    });
  }

  public async findOneById(id: string): Promise<UserWithoutSensitiveInfo> {
    const user: UserWithoutSensitiveInfo | null =
      await this.prisma.client.user.findUnique({
        where: {
          id,
        },
        select: this.userSelect,
      });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado', {
        description: 'Error: Usuario no encontrado por Id',
      });
    }
    return user;
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: {
        email,
      },
    });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutSensitiveInfo> {
    const user: UserWithoutSensitiveInfo = await this.findOneById(id);
    if (updateUserDto.email && user.email !== updateUserDto.email) {
      const userByEmail: User | null = await this.findOneByEmail(
        updateUserDto.email,
      );
      if (userByEmail) {
        throw new BadRequestException('Error al crear usuario', {
          description: `Ya existe un usuario con este email`,
        });
      }
    }
    try {
      let client = {};
      if (updateUserDto.role === 'CLIENT') {
        client = {
          update: { name: updateUserDto.clientName },
        };
      }
      const updatedUser: UserWithoutSensitiveInfo =
        await this.prisma.client.user.update({
          data: {
            name: updateUserDto.name,
            email: updateUserDto.email,
            password: updateUserDto.password,
            role: updateUserDto.role,
            salt: '',
            client,
          },
          where: {
            id,
          },
          select: this.userSelect,
        });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Error al editar usuario', {
        description: `Error: ${error}`,
      });
    }
  }

  public async remove(id: string): Promise<UserWithoutSensitiveInfo> {
    await this.findOneById(id);
    try {
      const user: UserWithoutSensitiveInfo =
        await this.prisma.client.user.softDelete(id);
      return user;
    } catch (error) {
      throw new BadRequestException('Error al eliminar usuario', {
        description: `Error: ${error}`,
      });
    }
  }
}
