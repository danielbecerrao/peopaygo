import { Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import type { AccessToken } from '../common/interfaces/access-token.interface';

@Controller()
@ApiTags('Autenticación')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: AuthDto })
  public async login(@GetUser() user: User): Promise<AccessToken> {
    return this.authService.login(user);
  }
}
