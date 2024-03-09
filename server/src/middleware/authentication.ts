import { ManagementClient, UserInfoClient } from 'auth0';
import { auth } from 'express-oauth2-jwt-bearer';
import express from 'express';
import asyncHandler from 'express-async-handler';
import LOGGER from '../configs/logging';
import { Auth0User } from '../types/custom';

// Check that all required environment variables are set
if (!process.env.AUTH0_DOMAIN) {
  LOGGER.error('AUTH0_DOMAIN environment variable not set');
  process.exit();
}
if (!process.env.AUTH0_CLIENT_ID) {
  LOGGER.error('AUTH0_CLIENT_ID environment variable not set');
  process.exit();
}
if (!process.env.AUTH0_CLIENT_SECRET) {
  LOGGER.error('AUTH0_CLIENT_SECRET environment variable not set');
  process.exit();
}
if (!process.env.BACKEND_AUDIENCE) {
  LOGGER.error('BACKEND_AUDIENCE environment variable not set');
  process.exit();
}

const userInfoClient = new UserInfoClient({
  domain: process.env.AUTH0_DOMAIN!!,
});

const manageClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});

export const checkJwt = auth({
  audience: process.env.BACKEND_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

const retrieveUserInfo = async (accessToken: string): Promise<Auth0User> => userInfoClient
  .getUserInfo(accessToken).then((user) => {
    if (user.status !== 200) {
      LOGGER.error(user.statusText);
      throw new Error('Failed to retrieve user info');
    }

    return {
      id: user.data.sub,
      email: user.data.email,
      firstName: user.data.given_name,
      lastName: user.data.family_name,
      picture: user.data.picture,
    };
  });

export const requireAuth0User = asyncHandler(async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.auth?.token) {
    res.status(401).json({
      error: 'Missing or invalid Authorization header',
    });
    return;
  }

  try {
    req.auth0 = await retrieveUserInfo(req.auth.token); // Add the user to the request
    next(); // Continue to the next middleware
  } catch (error) {
    res.status(500).send({
      error: 'Failed to retrieve user info',
    });
  }
});

export const updateAuth0User = async (user: Auth0User) => {
  manageClient.users.update({
    id: user.id,
  }, {
    ...user,
  }).then((result) => {
    if (result.status !== 200) {
      LOGGER.warn(result.statusText);
      throw new Error('Failed to update user info');
    }
    LOGGER.debug(`Successfully updated user info of ${user.id}`);
  });
};
