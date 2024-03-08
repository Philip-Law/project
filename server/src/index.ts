import express from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import AppDataSource from './configs/db';
import { messageRoutes, postRoutes, userRoutes } from './routes';
import LOGGER from './configs/logging';

const app = express();
const PORT = process.env.PORT || 8080;

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/message', messageRoutes);

app.use((err: Error, _req: express.Request, res: express.Response) => {
  LOGGER.error(err.message, err.stack);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
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
