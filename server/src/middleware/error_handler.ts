import express from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { ZodError } from 'zod';
import LOGGER from '../configs/logging';

const errorMiddleware = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  LOGGER.info(err.message, err.stack);
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: 'Unauthorized' });
    return next();
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      message: `Bad Request: ${err.errors[0].message}`,
    });
  }

  res.status(500).json({ message: 'Internal Server Error' });
  return next();
};

export default errorMiddleware;
