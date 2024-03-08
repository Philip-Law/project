import pino from 'pino';
import express from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import AppDataSource from './configs/db';
import { messageRoutes, postRoutes, userRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 8080;

const logger = pino({
  name: 'tmu-connect-api',
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
});

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/message', messageRoutes);

app.use((err: Error, _req: express.Request, res: express.Response) => {
  logger.error(err.message, err.stack);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    logger.debug('Successfully connected to database');
    app.listen(PORT, () => {
      logger.info('TMU Connect server listening on PORT 8080.');
    });
  })
  .catch((error) => {
    logger.fatal(`Could not connect to database: ${error}`);
  });
