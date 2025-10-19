import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  PurchaseRequest,
  PurchaseResponse,
  UserCornTotal,
} from '@packages/shared';

@Injectable()
export class PurchaseService {
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

    user.lastPurchase = now;

    user.totalCorns += 1;

    await this.userRepo.save(user);

    return {
      success: true,
      message: 'Corn purchased! 🌽',
      cornsPurchased: 1,
      nextAvailableAt: new Date(now.getTime() + 60000),
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
