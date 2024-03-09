import express from 'express';
import bodyParser from 'body-parser';
import AppDataSource from './configs/db';
import { messageRoutes, postRoutes, userRoutes } from './routes';
import LOGGER from './configs/logging';
import errorHandler from './middleware/error_handler';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/post', postRoutes);

app.use('/message', messageRoutes);
app.use(errorHandler);

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
