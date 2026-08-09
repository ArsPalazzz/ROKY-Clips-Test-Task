import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { validateEnv } from './config/env.validation';

config();

const env = validateEnv(process.env);

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
