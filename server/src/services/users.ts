import { User } from '../entities';
import AppDataSource from '../configs/db';
import LOGGER from '../configs/logging';
import { APIError, Auth0User, Status } from '../types';
import { retrieveAuth0Users, retrieveAuth0User } from './auth0';

const isUserSetup = async (id: string): Promise<boolean> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('id = :id', { id })
    .getOne();
  return user !== null;
};

export const setupUser = async (user: User) => {
  const isAlreadySetup = await isUserSetup(user.id);
  if (isAlreadySetup) {
    throw new APIError(
      Status.BAD_REQUEST,
      `User with auth0_id ${user.id} already exists`,
    );
  }

  const result = await AppDataSource.getRepository(User)
    .insert(user);

  if (result.identifiers.length !== 1) {
    throw new APIError(
      Status.INTERNAL_SERVER_ERROR,
      `Insert user attempt returned ${result.identifiers.length} identifiers for user's id ${user.id}`,
    );
  }
};

export const getUser = async (id: string): Promise<User> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('id = :id', { id })
    .getOne();

  if (!user) {
    throw new APIError(
      Status.NOT_FOUND,
      `User with id ${id} does not exist`,
    );
  }
  return user;
};

export const getCompleteUser = async (id: string) => {
  const auth0User = await retrieveAuth0User(id);
  const user = await getUser(id);
  return {
    ...auth0User,
    ...user,
  };
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  const repo = AppDataSource.getRepository(User);
  const result = await repo
    .createQueryBuilder()
    .update(User)
    .set({ major: updatedUser.major, phoneNumber: updatedUser.phoneNumber, year: updatedUser.year })
    .where('id = :id', { id: updatedUser.id })
    .execute();
  if (result.affected !== 1) {
    throw new APIError(
      Status.INTERNAL_SERVER_ERROR,
      `Update user attempt affected ${result.affected} rows for user's auth0_id ${updatedUser.id}`,
    );
  }
  return getUser(updatedUser.id);
};

export const deleteUser = async (auth0User: Auth0User, id: string): Promise<void> => {
  if (auth0User.id !== id && !auth0User.isAdmin) {
    throw new APIError(Status.FORBIDDEN, 'You are not authorized to delete this user');
  }

  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id })
    .execute();
  if (result.affected === 0) {
    LOGGER.info(`Delete user attempt for auth0_id ${id} did not affect any rows`);
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
  return auth0Users.filter((auth0User) => users.some((user) => user.id === auth0User.id))
    .map((auth0User) => {
      const user = users.find((u) => u.id === auth0User.id);
      return {
        ...auth0User,
        ...user,
      };
    });
};
