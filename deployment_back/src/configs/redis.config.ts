import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const redisConfig: RedisModuleOptions = {
  config: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};
