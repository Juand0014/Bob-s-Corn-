interface AppConfig {
  apiUrl: string;
  apiDocsUrl: string;
  appName: string;
  appDescription: string;
  rateLimitMessage: string;
  nodeEnv: string;
}

export class ConfigService {
  static getConfig(): AppConfig {
    return {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      apiDocsUrl:
        process.env.NEXT_PUBLIC_API_DOCS_URL || 'http://localhost:3001/api',
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Bob's Corn",
      appDescription:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Fresh corn for everyone!',
      rateLimitMessage:
        process.env.NEXT_PUBLIC_RATE_LIMIT_MESSAGE ||
        'Fair policy: 1 corn per minute per customer',
      nodeEnv: process.env.NODE_ENV || 'development',
    };
  }

  static getApiUrl(): string {
    return this.getConfig().apiUrl;
  }

  static getApiDocsUrl(): string {
    return this.getConfig().apiDocsUrl;
  }

  static isProduction(): boolean {
    return this.getConfig().nodeEnv === 'production';
  }

  static isDevelopment(): boolean {
    return this.getConfig().nodeEnv === 'development';
  }
}
