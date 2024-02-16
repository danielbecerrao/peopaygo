import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { UserWithoutSensitiveInfo } from '../common/types/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutSensitiveInfo> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<UserWithoutSensitiveInfo[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async findOneById(
    @Param('id') id: string,
  ): Promise<UserWithoutSensitiveInfo> {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutSensitiveInfo> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  public async remove(
    @Param('id') id: string,
  ): Promise<UserWithoutSensitiveInfo> {
    return this.usersService.remove(id);
  }
}
