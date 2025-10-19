import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from './rate-limiter.service';
import { ConfigService } from '../config/config.service';
import { RateLimitResult, RateLimitConfig } from '@packages/shared';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  private async getRateLimitResult(
    userId: string,
    machineId: string,
  ): Promise<RateLimitResult> {
    return this.rateLimiterService.checkRateLimit(userId, machineId);
  }

  private getRateLimitConfig(): RateLimitConfig {
    return ConfigService.getRateLimitConfig();
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const machineId = this.getClientIdentifier(req);

      const userId = (req.body as { userId?: string })?.userId || '';

      const result = await this.getRateLimitResult(userId, machineId);

      this.setRateLimitHeaders(res, result);

      if (!result.allowed) {
        res.status(429).json({
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          resetTime: result.resetTime,
        });
        return;
      }

      const rateLimitConfig = this.getRateLimitConfig();

      const nextRequestTime = Math.ceil(rateLimitConfig.windowMs / 1000);

      res.setHeader('Retry-After', nextRequestTime.toString());

      next();
    } catch (error) {
      console.error('Rate limiter middleware error:', error);
      next();
    }
  }

  private getClientIdentifier(req: Request): string {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    const userAgent = req.get('User-Agent') || 'unknown';

    return `${ip}:${userAgent}`;
  }

  private setRateLimitHeaders(res: Response, result: RateLimitResult): void {
    if (result.remainingRequests !== undefined) {
      res.setHeader(
        'X-RateLimit-Remaining',
        result.remainingRequests.toString(),
      );
    }

    if (result.resetTime) {
      res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil(result.resetTime / 1000).toString(),
      );
    }

    if (result.retryAfter) {
      res.setHeader('Retry-After', result.retryAfter.toString());
    }
  }
}
