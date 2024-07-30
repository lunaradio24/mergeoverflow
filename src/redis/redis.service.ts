import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = Number(this.configService.get<number>('REDIS_PORT'));
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async expireAt(key: string, timestamp: number): Promise<void> {
    await this.redis.expireat(key, timestamp);
  }

  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key);
  }
}
