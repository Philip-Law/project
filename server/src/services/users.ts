import { User } from '../entities';
import AppDataSource from '../configs/db';
import LOGGER from '../configs/logging';

export const doesUserExist = async (auth0Id: string): Promise<boolean> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('auth0_id = :auth0Id', { auth0Id })
    .getOne();
  return user !== null;
};

export const setupUser = async (user: User): Promise<number> => {
  const isAlreadySetup = await doesUserExist(user.auth0Id);
  if (isAlreadySetup) {
    throw new Error(`User with auth0_id ${user.auth0Id} already exists`);
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
    throw new Error(`User with auth0_id ${auth0Id} does not exist`);
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
    throw new Error(`Update user attempt affected ${result.affected} rows for user's auth0_id ${updatedUser.auth0Id}`);
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
