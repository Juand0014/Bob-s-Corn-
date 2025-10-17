import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PurchaseRequest, PurchaseResult } from '@packages/shared';

@Injectable()
export class PurchaseService {
  private readonly RATE_LIMIT_MS = 60000;

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async purchaseCorn(request: PurchaseRequest): Promise<PurchaseResult> {
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

    return {
      success: true,
      message: 'Corn purchased!',
      cornsPurchased: 1,
      nextAvailableAt: new Date(now.getTime() + this.RATE_LIMIT_MS),
    };
  }
}
