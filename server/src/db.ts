import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from './entities/User';
import Post from './entities/post';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User, Post],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
