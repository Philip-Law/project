import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Conversation, Message, Post, User,
} from '../entities';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User, Post, Conversation, Message],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
