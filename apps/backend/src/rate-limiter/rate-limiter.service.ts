import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '../config/config.service';
import { RateLimitResult, RateLimitConfig } from '@packages/shared';

@Injectable()
export class RateLimiterService {
  private readonly windowSizeMs: number;
  private readonly maxRequests: number;
  private readonly limitBy: 'user' | 'machine';

  constructor(private readonly redisService: RedisService) {
    const rateLimitConfig = this.getRateLimitConfig();

    this.windowSizeMs = rateLimitConfig.windowMs;

    this.maxRequests = rateLimitConfig.maxRequests;

    this.limitBy = rateLimitConfig.limitBy;
  }

  private getRateLimitConfig(): RateLimitConfig {
    return ConfigService.getRateLimitConfig();
  }

  private generateRateLimitKey(userId?: string, machineId?: string): string {
    const identifier = userId || machineId;

    return `rate_limit:${this.limitBy}:${identifier}`;
  }

  async checkRateLimit(
    userId: string,
    machineId: string,
  ): Promise<RateLimitResult> {
    const now = Date.now();

    const windowStart = now - this.windowSizeMs;

    const key = this.generateRateLimitKey(userId, machineId);

    try {
      const pipeline = this.redisService.redis.pipeline();

      pipeline.zremrangebyscore(key, 0, windowStart);

      pipeline.zcard(key);

      const results = await pipeline.exec();

      if (!results || results.some(([err]) => err)) {
        return { allowed: true, remainingRequests: this.maxRequests };
      }

      const currentCount = results[1][1] as number;

      if (currentCount >= this.maxRequests) {
        const oldestRequest = await this.redisService.redis.zrange(
          key,
          0,
          0,
          'WITHSCORES',
        );

        const resetTime =
          oldestRequest.length > 0
            ? parseInt(oldestRequest[1]) + this.windowSizeMs
            : now + this.windowSizeMs;

        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return {
          allowed: false,
          remainingRequests: 0,
          resetTime,
          retryAfter: Math.max(1, retryAfter),
        };
      }

      return {
        allowed: true,
        remainingRequests: this.maxRequests - currentCount,
        resetTime: now + this.windowSizeMs,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);

      return { allowed: true, remainingRequests: this.maxRequests };
    }
  }

  async recordSuccessfulRequest(
    userId: string,
    machineId: string,
  ): Promise<void> {
    const now = Date.now();

    const key = this.generateRateLimitKey(userId, machineId);

    try {
      const pipeline = this.redisService.redis.pipeline();

      pipeline.zadd(key, now, now);

      pipeline.expire(key, Math.ceil(this.windowSizeMs / 1000));

      await pipeline.exec();
    } catch (error) {
      console.error('Error recording successful request:', error);
    }
  }
}
