import 'reflect-metadata';
import { DataSource } from 'typeorm';
import pino from 'pino';
import User from './User';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});

const logger = pino({
  name: 'database',
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    logger.debug('Successfully connected to database');
  })
  .catch((error) => logger.error('Could not connect to database: ', error));

export default AppDataSource;
