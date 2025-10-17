import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../purchase/entities/user.entity';
import { ConfigService } from './config.service';

export const databaseConfig = (): TypeOrmModuleOptions => {
  const dbConfig = ConfigService.getDatabaseConfig();
  const serverConfig = ConfigService.getServerConfig();

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [User],
    synchronize: serverConfig.nodeEnv !== 'production',
    logging: serverConfig.nodeEnv === 'development',
  };
};
