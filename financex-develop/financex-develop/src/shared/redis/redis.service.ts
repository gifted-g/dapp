import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private redis: Redis) {}

  private readonly logger = new Logger(RedisService.name);

  private CACHE_TTL = 60 * 60 * 24; // 24 hours
  private BUSINESS_STATS_KEY = 'business_stats';

  private getBusinessStatCacheKey(businessId: string) {
    return `${this.BUSINESS_STATS_KEY}:${businessId}`;
  }

  // distributed lock
  async acquireLock(key: string, value: string, ttl = 30 * 60 * 1000) {
    const result = await this.redis.set(key, value, 'PX', ttl, 'NX');

    return result === 'OK';
  }

  async releaseLock(key: string, value: string) {
    const script = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
            `;

    const result = await this.redis.eval(script, 1, key, value);

    return result === 1;
  }

  async getBusinessStats(businessId: string) {
    try {
      const stats = await this.redis.get(
        this.getBusinessStatCacheKey(businessId),
      );

      if (stats) {
        return JSON.parse(stats);
      }
    } catch (error) {
      this.logger.error(`Error getting stats from cache: ${error.message}`);
    }

    return null;
  }

  async setBusinessStats(businessId: string, stats: any) {
    try {
      await this.redis.set(
        this.getBusinessStatCacheKey(businessId),
        JSON.stringify(stats),
        'EX',
        this.CACHE_TTL,
      );
    } catch (error) {
      this.logger.error(`Error setting stats in cache: ${error.message}`);
    }
  }

  async invalidateBusinessStatsCache(businessId: string) {
    try {
      await this.redis.del(this.getBusinessStatCacheKey(businessId));
    } catch (error) {
      this.logger.error(
        `Error deleting business stats cache: ${error.message}`,
      );
    }
  }
}
