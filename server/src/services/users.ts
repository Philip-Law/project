import { User } from '../entities';
import AppDataSource from '../configs/db';
import LOGGER from '../configs/logging';
import { setUserMetadata } from './auth0';
import { APIError, Status } from '../types';

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
  const userId = result.identifiers[0].id;
  await setUserMetadata(user.auth0Id, { userId });
  return userId;
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

export const deleteUser = async (auth0Id: string): Promise<void> => {
  const result = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .delete()
    .where('auth0_id = :auth0Id', { auth0Id })
    .execute();
  if (result.affected === 0) {
    LOGGER.info(`Delete user attempt for auth0_id ${auth0Id} did not affect any rows`);
  }
};
