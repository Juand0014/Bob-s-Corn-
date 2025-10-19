import { RateLimitConfig } from '@packages/shared';

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface ServerConfig {
  port: number;
  corsOrigin: string;
  nodeEnv: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export class ConfigService {
  static getDatabaseConfig(): DatabaseConfig {
    return {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres123',
      database: process.env.POSTGRES_DB || 'bobs_corn_db',
    };
  }

  static getServerConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT) || 3001,
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }

  static getRateLimitConfig(): RateLimitConfig {
    return {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1,
      limitBy: (process.env.RATE_LIMIT_BY as 'user' | 'machine') || 'machine',
    };
  }

  static getRedisConfig(): RedisConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB) || 0,
    };
  }
}
