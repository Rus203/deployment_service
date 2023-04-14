import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { AccessTokenDto } from './dto/access-token.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRedis() private redisClient: Redis,
    private jwtService: JwtService,
  ) {}

  async getOne(userId: string) {
    return this.redisClient.get(userId);
  }

  async delete(userId: string) {
    this.redisClient.del(userId);
  }

  async createOrUpdate(dto: AccessTokenDto) {
    const accessToken = await this.jwtService.signAsync(dto);

    await this.redisClient.set(dto.userId, accessToken);

    return accessToken;
  }
}
