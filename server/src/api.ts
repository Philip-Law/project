import pino from 'pino';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { checkJwt } from './authentication';

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

app.get('/posts', (_req, res) => {
  res.json([
    {
      id: 1,
      title: 'Hello World',
    },
  ]);
});

app.get('/post/:id', (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Hello World',
  });
});

app.post('/post', checkJwt, asyncHandler(async (_req, res) => {
  res.send('Hello World');
}));

app.delete('/post/:id', checkJwt, (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Hello World',
  });
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  logger.error(err.message, err.stack);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info('TMU Connect server listening on PORT 8080.');
});
