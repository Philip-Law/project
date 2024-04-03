import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Conversation, Message, Post, User,
} from '../entities';

const AppDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  url: process.env.DATABASE_URL,
  ssl: process.env.ENVIRONMENT === 'prod',
  synchronize: false,
  logging: ['warn', 'error'],
  entities: [User, Post, Conversation, Message],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
