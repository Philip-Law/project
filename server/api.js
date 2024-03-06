const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const pino = require('pino');

const app = express();

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
});

const checkJwt = auth({
  audience: process.env.BACKEND_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

app.listen(8080, () => {
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
