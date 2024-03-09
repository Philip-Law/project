import express from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { ZodError } from 'zod';
import AppDataSource from './configs/db';
import { messageRoutes, postRoutes, userRoutes } from './routes';
import LOGGER from './configs/logging';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/message', messageRoutes);

app.use((
  err: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  LOGGER.info(err.message, err.stack);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: 'Unauthorized' });
    return next();
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      message: `Bad Request: ${err.errors[0].message}`,
    });
  }

  res.status(500).json({ message: 'Internal Server Error' });
  return next();
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
    LOGGER.debug('Successfully connected to database');
    app.listen(PORT, () => {
      LOGGER.info('TMU Connect server listening on PORT 8080.');
    });
  })
  .catch((error) => {
    LOGGER.fatal(`Could not connect to database: ${error}`);
  });
