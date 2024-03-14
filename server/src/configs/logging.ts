import pino from 'pino';

const LOGGER = pino({
  name: 'tmu-connect-api',
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default LOGGER;
