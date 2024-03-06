import {checkJwt} from "./authentication";
import pino from 'pino';
import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

const logger = pino({
  name: 'tmu-connect-api',
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
});

app.listen(port, () => {
  logger.info('TMU Connect server listening on port 8080!');
});

app.get('/posts', (req, res) => {
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

app.post('/post', checkJwt, (req, res) => {
  res.json({
    id: 2,
    title: 'Hello World',
  });
});

app.delete('/post/:id', checkJwt, (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Hello World',
  });
});
