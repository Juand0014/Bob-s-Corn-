export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface ServerConfig {
  port: number;
  corsOrigin: string;
  nodeEnv: string;
}

export interface RateLimitConfig {
  windowMs: number;
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
    };
  }
}
