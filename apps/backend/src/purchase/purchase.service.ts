import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  PurchaseRequest,
  PurchaseResult,
  UserCornTotal,
} from '@packages/shared';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);
  private readonly RATE_LIMIT_MS = 60000;

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async purchaseCorn(request: PurchaseRequest): Promise<PurchaseResult> {
    this.logger.log(`Purchase attempt for user: ${request.userId}`);
    const now = new Date();

    let user = await this.userRepo.findOne({ where: { id: request.userId } });
    if (!user) {
      this.logger.log(`Creating new user: ${request.userId}`);
      user = this.userRepo.create({
        id: request.userId,
        totalCorns: 0,
        lastPurchase: null,
      });
    }
    if (user.lastPurchase) {
      const timeSince = now.getTime() - user.lastPurchase.getTime();

      if (timeSince < this.RATE_LIMIT_MS) {
        this.logger.warn(
          `Rate limit exceeded for user ${request.userId}. Retry after ${Math.ceil((this.RATE_LIMIT_MS - timeSince) / 1000)}s`,
        );
        return {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'You can only purchase 1 corn per minute.',
          retryAfter: Math.ceil((this.RATE_LIMIT_MS - timeSince) / 1000),
          nextAvailableAt: new Date(
            user.lastPurchase.getTime() + this.RATE_LIMIT_MS,
          ),
        };
      }
    }

    user.lastPurchase = now;

    user.totalCorns += 1;

    await this.userRepo.save(user);

    this.logger.log(
      `Corn purchased successfully for user ${request.userId}. Total corns: ${user.totalCorns}`,
    );

    return {
      success: true,
      message: 'Corn purchased! 🌽',
      cornsPurchased: 1,
      nextAvailableAt: new Date(now.getTime() + this.RATE_LIMIT_MS),
    };
  }

  async getUserCornTotal(userId: string): Promise<UserCornTotal> {
    this.logger.log(`Fetching corn total for user: ${userId}`);
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      return {
        userId,
        totalCorns: 0,
        lastPurchase: null,
      };
    }

    return {
      userId: user.id,
      totalCorns: user.totalCorns,
      lastPurchase: user.lastPurchase,
    };
  }
}
