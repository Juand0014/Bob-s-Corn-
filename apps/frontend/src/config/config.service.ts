interface AppConfig {
  apiUrl: string;
  nodeEnv: string;
}

export class ConfigService {
  static getConfig(): AppConfig {
    return {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }

  static getApiUrl(): string {
    return this.getConfig().apiUrl;
  }

  static isProduction(): boolean {
    return this.getConfig().nodeEnv === 'production';
  }

  static isDevelopment(): boolean {
    return this.getConfig().nodeEnv === 'development';
  }
}
