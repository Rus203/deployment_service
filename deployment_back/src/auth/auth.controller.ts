import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthSignInResponseDto } from './dto/auth-sign-in-response.dto';
import { AuthUpdateTokensDto } from './dto/auth-update-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConflictResponse({ description: 'Such email has already here' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiResponse({ status: 201, description: 'No content' })
  @Post('sign-up')
  async signUp(@Body() dto: AuthSignUpDto) {
    await this.authService.signUp(dto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiResponse({ status: 201, type: AuthSignInResponseDto })
  @Post('sign-in')
  async signIn(@Body() dto: AuthSignInDto) {
    return this.authService.signIn(dto);
  }

  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiResponse({ status: 200, type: AuthUpdateTokensDto })
  @Post('refresh')
  async updateTokes(@Body() dto: AuthRefreshDto) {
    return await this.authService.updateTokens(dto);
  }
}
