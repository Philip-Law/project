// Check that all required environment variables are set
import { ManagementClient, UserInfoClient } from 'auth0';
import LOGGER from '../configs/logging';
import { APIError, Auth0User, Status } from '../types';

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

export const retrieveUserInfo = async (accessToken: string) => userInfoClient
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

export const retrieveAuth0Users = async (options?: {
  name?: string;
  email?: string;
}): Promise<Array<Auth0User>> => {
  let query = options?.name ? `name:*${options.name}*` : '';
  query += options?.email ? `email:*${options.email}*` : '';

  return managementClient.users.getAll({
    q: query,
  }).then((users) => {
    if (users.status !== 200) {
      throw new APIError(
        Status.INTERNAL_SERVER_ERROR,
        'Failed to retrieve users',
        users.statusText,
      );
    }

    return users.data.map((user) => ({
      id: user.user_id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      picture: user.picture,
    }));
  });
};

export const retrieveAuth0UserFirstName = async (id: string): Promise<string> => managementClient
  .users.get({ id }).then((user) => {
    if (user.status !== 200) {
      throw new APIError(
        Status.INTERNAL_SERVER_ERROR,
        'Failed to retrieve user',
        user.statusText,
      );
    }
    return user.data.given_name;
  });
