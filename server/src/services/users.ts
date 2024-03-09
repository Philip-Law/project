import { User } from '../entities';
import AppDataSource from '../configs/db';

export const setupUser = async (auth0Id: string, major: string, year: number): Promise<number> => {
  const result = await AppDataSource.getRepository(User)
    .insert(new User(0, auth0Id, major, year));
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

export const updateUser = async (auth0Id: string, major: string, year: number): Promise<User> => {
  const repo = AppDataSource.getRepository(User);
  const result = await repo
    .createQueryBuilder()
    .update(User)
    .set({ major, year })
    .where('auth0_id = :auth0Id', { auth0Id })
    .execute();
  if (result.affected !== 1) {
    throw new Error(`Update user attempt affected ${result.affected} rows for user's auth0_id ${auth0Id}`);
  }
  return getUser(auth0Id);
};

export const doesUserExist = async (auth0Id: string): Promise<boolean> => {
  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder()
    .where('auth0_id = :auth0Id', { auth0Id })
    .getOne();
  return user !== null;
};
