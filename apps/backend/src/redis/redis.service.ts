import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor() {
    const config = ConfigService.getRedisConfig();

    this.client = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      maxRetriesPerRequest: 3,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.ping();

      console.log('Redis connection established');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  get redis(): Redis {
    return this.client;
  }
}
