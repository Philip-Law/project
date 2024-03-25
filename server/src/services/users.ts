import { User } from '../entities';
import AppDataSource from '../configs/db';
import LOGGER from '../configs/logging';
import { APIError, Auth0User, Status } from '../types';
import { retrieveAuth0Users } from './auth0';

const isUserSetup = async (auth0Id: string): Promise<boolean> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('auth0_id = :auth0Id', { auth0Id })
    .getOne();
  return user !== null;
};

export const setupUser = async (user: User): Promise<number> => {
  const isAlreadySetup = await isUserSetup(user.auth0Id);
  if (isAlreadySetup) {
    throw new APIError(
      Status.BAD_REQUEST,
      `User with auth0_id ${user.auth0Id} already exists`,
    );
  }

  const result = await AppDataSource.getRepository(User)
    .insert(user);
  return result.identifiers[0].id;
};

export const getUser = async (auth0Id: string): Promise<User> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('auth0_id = :auth0Id', { auth0Id })
    .getOne();

  if (!user) {
    throw new APIError(
      Status.NOT_FOUND,
      `User with auth0_id ${auth0Id} does not exist`,
    );
  }
  return user;
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  const repo = AppDataSource.getRepository(User);
  const result = await repo
    .createQueryBuilder()
    .update(User)
    .set({ major: updatedUser.major, phoneNumber: updatedUser.phoneNumber, year: updatedUser.year })
    .where('auth0_id = :auth0Id', { auth0Id: updatedUser.auth0Id })
    .execute();
  if (result.affected !== 1) {
    throw new APIError(
      Status.INTERNAL_SERVER_ERROR,
      `Update user attempt affected ${result.affected} rows for user's auth0_id ${updatedUser.auth0Id}`,
    );
  }
  return getUser(updatedUser.auth0Id);
};

export const deleteUser = async (auth0User: Auth0User, auth0Id: string): Promise<void> => {
  if (auth0User.id !== auth0Id && !auth0User.isAdmin) {
    throw new APIError(Status.FORBIDDEN, 'You are not authorized to delete this user');
  }

  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .delete()
    .where('auth0_id = :auth0Id', { auth0Id })
    .execute();
  if (result.affected === 0) {
    LOGGER.info(`Delete user attempt for auth0_id ${auth0Id} did not affect any rows`);
  }
};

export const retrieveUsersBy = async (options?: {
  name?: string;
  email?: string;
  major?: string;
  year?: number;
}) => {
  const auth0Users = await retrieveAuth0Users(options);
  const usersQuery = AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('LOWER(major) LIKE LOWER(:major)', { major: `%${options?.major || ''}%` });
  if (options?.year) {
    usersQuery.andWhere('year = :year', { year: options.year });
  }
  const users = await usersQuery.getMany();

  // Merge the two arrays of users based on their shared auth0_id.
  return auth0Users.filter((auth0User) => users.some((user) => user.auth0Id === auth0User.id))
    .map((auth0User) => {
      const user = users.find((u) => u.auth0Id === auth0User.id);
      return {
        ...auth0User,
        ...user,
      };
    });
};
