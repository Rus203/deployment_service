import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConflictResponse({ description: 'Such email has already here' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('sign-up')
  async signUp(@Body() dto: AuthSignUpDto): Promise<void> {
    await this.authService.signUp(dto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('sign-in')
  async signIn(@Body() dto: AuthSignInDto): Promise<any> {
    return this.authService.signIn(dto);
  }

  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('refresh')
  async updateTokes(@Body() dto: AuthRefreshDto): Promise<any> {
    return await this.authService.updateTokens(dto);
  }
}
