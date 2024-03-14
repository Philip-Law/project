import { auth } from 'express-oauth2-jwt-bearer';
import express from 'express';
import asyncHandler from 'express-async-handler';
import LOGGER from '../configs/logging';
import { retrieveUserInfo } from '../services/auth0';

if (!process.env.BACKEND_AUDIENCE) {
  LOGGER.error('BACKEND_AUDIENCE environment variable not set');
  process.exit();
}

export const checkJwt = auth({
  audience: process.env.BACKEND_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
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
