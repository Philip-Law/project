import { Auth0User } from '../custom';

declare global {
  namespace Express {
    export interface Request {
      auth0?: Auth0User
    }
  }
}

export {};
