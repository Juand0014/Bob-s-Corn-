import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '../config/config.service';
import {
  PurchaseRequest,
  PurchaseResponse,
  UserCornTotal,
} from '@packages/shared';

@Injectable()
export class PurchaseService {
  private readonly RATE_LIMIT_MS = ConfigService.getRateLimitConfig().windowMs;

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async purchaseCorn(request: PurchaseRequest): Promise<PurchaseResponse> {
    const now = new Date();

    let user = await this.userRepo.findOne({ where: { id: request.userId } });

    if (!user) {
      user = this.userRepo.create({
        id: request.userId,
        totalCorns: 0,
        lastPurchase: null,
      });
    }

    if (user.lastPurchase) {
      const timeSince = now.getTime() - user.lastPurchase.getTime();

      if (timeSince < this.RATE_LIMIT_MS) {
        const retryAfter = Math.ceil((this.RATE_LIMIT_MS - timeSince) / 1000);

        throw new HttpException(
          {
            error: 'RATE_LIMIT_EXCEEDED',
            message: 'You can only purchase 1 corn per minute.',
            retryAfter,
            nextAvailableAt: new Date(
              user.lastPurchase.getTime() + this.RATE_LIMIT_MS,
            ),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    user.lastPurchase = now;

    user.totalCorns += 1;

    await this.userRepo.save(user);

    return {
      success: true,
      message: 'Corn purchased! 🌽',
      cornsPurchased: 1,
      nextAvailableAt: new Date(now.getTime() + this.RATE_LIMIT_MS),
    };
  }

  async getUserCornTotal(userId: string): Promise<UserCornTotal> {
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
