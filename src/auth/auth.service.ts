import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import type { AccessToken } from '../common/interfaces/access-token.interface';
import type { Payload } from '../common/interfaces/payload.interface';
import type { UserWithoutSensitiveInfo } from '../common/types/types';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithoutSensitiveInfo | null> {
    const user: User | null = await this.usersService.findOneByEmail(email);
    if (user) {
      const hashedPassword = await bcrypt.hash(pass, user.salt);
      if (user.password === hashedPassword) {
        const { password, salt, ...result } = user;
        return result;
      }
    }
    return null;
  }

  public async login(user: User): Promise<AccessToken> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
