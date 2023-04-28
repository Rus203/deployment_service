import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import bcrypt from 'bcrypt';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { AccessTokenService } from 'src/access-token/access-token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private accessTokenService: AccessTokenService,
  ) {}
  async signUp(dto: AuthSignUpDto): Promise<void> {
    const { email } = dto;
    const user: User = await this.userService.findOne({ email });

    if (user) {
      throw new ConflictException('Such email has already here');
    }

    dto.password = await bcrypt.hash(dto.password, 10);
    await this.userService.create(dto);
  }

  async signIn(dto: AuthSignInDto) {
    const { password, email } = dto;
    const user: User = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException("Such a login wasn't found");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const refreshToken = await this.refreshTokenService.createOrUpdate({
      userId: user.id,
    });

    const accessToken = await this.accessTokenService.createOrUpdate({
      userId: user.id,
      email: user.email,
    });

    return { accessToken, refreshToken, name: user.name, email: user.email };
  }

  async updateTokens(dto: AuthRefreshDto) {
    const token = await this.refreshTokenService.getOne({
      content: dto.refreshToken,
    });

    if (!token) {
      throw new NotFoundException('There is no such a refresh token');
    }

    const { email } = await this.userService.findOne({ id: token.userId });

    const refreshToken = await this.refreshTokenService.createOrUpdate({
      userId: token.userId,
    });

    const accessToken = await this.accessTokenService.createOrUpdate({
      userId: token.userId,
      email,
    });

    return { accessToken, refreshToken };
  }
}
