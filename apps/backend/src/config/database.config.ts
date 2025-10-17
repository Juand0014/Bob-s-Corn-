import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../purchase/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres123',
  database: 'bobs_corn_db',
  entities: [User],
  synchronize: true,
  logging: true,
};
