import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseModule } from './purchase/purchase.module';
import { databaseConfig } from './config/database.config';
import { RedisService } from './redis/redis.service';
import { RateLimiterService } from './rate-limiter/rate-limiter.service';
import { RateLimiterMiddleware } from './rate-limiter/rate-limiter.middleware';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, RateLimiterService, ConfigService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes({ path: '/purchase', method: RequestMethod.POST });
  }
}
