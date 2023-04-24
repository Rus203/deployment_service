import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: AuthSignUpDto): Promise<void> {
    await this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: AuthSignInDto): Promise<any> {
    return this.authService.signIn(dto);
  }

  @Post('refresh')
  async updateTokes(@Body() dto: AuthRefreshDto): Promise<any> {
    return await this.authService.updateTokens(dto);
  }
}
