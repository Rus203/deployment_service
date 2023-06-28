import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GetRefreshTokenDto } from './dto/get-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async getOne(dto: GetRefreshTokenDto) {
    return await this.refreshRepository.findOneBy(dto);
  }

  async delete(id: string) {
    await this.refreshRepository.delete({ id });
  }

  verifyToken(refreshToken: string) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateToken(refresh: string) {
    this.verifyToken(refresh);
    const token = await this.getOne({ content: refresh });
    const content = await this.jwtService.signAsync({ userId: token.userId });

    token.content = content;

    await this.refreshRepository.save(token);
    return token;
  }

  async createOrUpdate(dto: RefreshTokenDto) {
    let token = await this.getOne({ userId: dto.userId });
    const content = await this.jwtService.signAsync({ userId: dto.userId });

    if (token !== null) {
      token.userId = dto.userId;
      token.content = content;
    } else {
      token = this.refreshRepository.create({
        content,
        userId: dto.userId,
      });
    }

    await this.refreshRepository.save(token);
    return content;
  }
}
