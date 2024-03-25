import { auth, JWTPayload } from 'express-oauth2-jwt-bearer';
import express from 'express';
import asyncHandler from 'express-async-handler';
import LOGGER from '../configs/logging';
import { retrieveUserInfo } from '../services/auth0';
import { APIError, Status } from '../types';

if (!process.env.BACKEND_AUDIENCE) {
  LOGGER.error('BACKEND_AUDIENCE environment variable not set');
  process.exit();
}

const ADMIN_PERMISSION = 'admin:manage';

export const checkJwt = auth({
  audience: process.env.BACKEND_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

const validateIsAdmin = (payload: JWTPayload) => {
  if (payload.permissions === undefined) {
    throw new APIError(Status.INTERNAL_SERVER_ERROR, 'Permissions attribute not found in token payload');
  }
  const permissions = payload.permissions as string[];

  if (!permissions?.includes(ADMIN_PERMISSION)) {
    throw new APIError(Status.FORBIDDEN, 'You are not authorized to perform this action');
  }
};

export const requireAuth0User = (options?: { isAdmin?: boolean }) => asyncHandler(async (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.auth?.token) {
    throw new APIError(Status.UNAUTHORIZED, 'Missing or invalid Authorization header');
  }

  if (options?.isAdmin) {
    validateIsAdmin(req.auth.payload);
  }

  try {
    req.auth0 = await retrieveUserInfo(req.auth.token); // Add the user to the request
    next(); // Continue to the next middleware
  } catch (error) {
    throw new APIError(Status.INTERNAL_SERVER_ERROR, `Failed to retrieve user info: ${error}`);
  }
});
