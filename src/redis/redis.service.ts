import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRedisClient } from '../utils/redis.utils';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisToken = this.configService.get<string>('REDIS_TOKEN');
    this.redis = createRedisClient(redisUrl, redisToken);
  }

  async set(key: string, value: string | number): Promise<void> {
    await this.redis.set(key, value);
  }

  async expireAt(key: string, timestamp: number): Promise<void> {
    await this.redis.expireat(key, timestamp);
  }

  async get(key: string): Promise<number> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}
