import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { User } from './entities/user.entity';
import { RateLimiterService } from '../rate-limiter/rate-limiter.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PurchaseController],
  providers: [PurchaseService, RateLimiterService, RedisService, ConfigService],
})
export class PurchaseModule {}
