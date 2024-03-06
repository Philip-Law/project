import {ManagementClient, UserInfoClient} from 'auth0';
import { auth } from 'express-oauth2-jwt-bearer';
import pino from "pino";

const logger = pino({
  name: 'authentication',
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['email'],
  },
});

// Check that all required environment variables are set
if (!process.env.AUTH0_DOMAIN) {
  logger.error('AUTH0_DOMAIN environment variable not set');
  process.exit();
}
if (!process.env.AUHT0_CLIENT_ID) {
  logger.error('AUHT0_CLIENT_ID environment variable not set');
  process.exit();
}
if (!process.env.AUTH0_CLIENT_SECRET) {
  logger.error('AUTH0_CLIENT_SECRET environment variable not set');
  process.exit();
}
if (!process.env.BACKEND_AUDIENCE) {
  logger.error('BACKEND_AUDIENCE environment variable not set');
  process.exit();
}

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!!,
  clientId: process.env.AUHT0_CLIENT_ID!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
});

export const checkJwt = auth({
  audience: process.env.BACKEND_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

const getIdentityUser = async (userId: string) => {
  management.users.get({ id: userId }).then((user) => user.data);
};

export default getIdentityUser;
