// Check that all required environment variables are set
import { ManagementClient, UserInfoClient } from 'auth0';
import LOGGER from '../configs/logging';
import { Auth0User, APIError, Status } from '../types';

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

const managementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  clientId: process.env.AUTH0_CLIENT_ID,
});

export const retrieveUserInfo = async (accessToken: string): Promise<Auth0User> => userInfoClient
  .getUserInfo(accessToken).then((user) => {
    if (user.status !== 200) {
      LOGGER.error(user.statusText);
      throw new APIError(
        Status.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user info',
      );
    }

    return {
      id: user.data.sub,
      email: user.data.email,
      firstName: user.data.given_name,
      lastName: user.data.family_name,
      picture: user.data.picture,
    };
  });

export const setUserMetadata = async (auth0Id: string, metadata: {
  [key: string]: any;
}) => managementClient
  .users.update({ id: auth0Id }, {
    user_metadata: metadata,
  }).catch((err) => {
    LOGGER.error(`Could not update user metadata for ${auth0Id}: ${err}`);
    throw new Error(err);
  });
