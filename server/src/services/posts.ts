import { Post } from '../entities';
import AppDataSource from '../configs/db';
import { getUser } from './users';
import { AdType, APIError, Status } from '../types';
import LOGGER from '../configs/logging';

interface CreatePostRequest {
  title: string;
  adType: AdType;
  description: string;
  location: string;
  categories: string[];
  price: number;
}

interface GetPostQuery {
  category?: string[];
  adType?: AdType;
  location?: string;
  title?: string;
}

export const createPost = async (
  auth0Id: string,
  postRequest: CreatePostRequest,
): Promise<number> => {
  const user = await getUser(auth0Id);
  const postRepository = AppDataSource.getRepository(Post);
  const post = postRepository.create({
    ...postRequest,
    user,
  });
  const result = await postRepository.insert(post);
  return result.identifiers[0].id;
};

export const getPost = async (postID: number): Promise<Post> => {
  const post = await AppDataSource.getRepository(Post)
    .findOneBy({ id: postID });

  if (!post) {
    throw new APIError(
      Status.NOT_FOUND,
      `Post with id ${postID} does not exist`,
    );
  }
  return post;
};

export const getPostsByQuery = async (query: GetPostQuery): Promise<Post[]> => AppDataSource
  .getRepository(Post)
  .createQueryBuilder('post')
  .where('LOWER(title) LIKE LOWER(:title)', { title: `%${query.title || ''}%` })
  .andWhere('LOWER(location) LIKE LOWER(:location)', { location: `%${query.location || ''}%` })
  .andWhere('ad_type LIKE :adType', { adType: `%${query.adType || ''}%` })
  .andWhere('categories @> :categories', { categories: query.category || [] })
  .getMany();

export const getLocations = async (): Promise<Post[]> => AppDataSource
  .getRepository(Post)
  .createQueryBuilder('post')
  .select('location')
  .distinct(true)
  .getRawMany();

export const deletePost = async (auth0Id: string, postID: number): Promise<void> => {
  const user = await getUser(auth0Id);
  const post = await getPost(postID);

  if (user.id !== post.user.id) {
    throw new APIError(
      Status.FORBIDDEN,
      'User does not have permission to delete this post',
    );
  }

  const result = await AppDataSource.getRepository(Post)
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id: postID })
    .execute();

  if (result.affected === 0) {
    LOGGER.info(`Delete post failed for id ${postID} because no rows were deleted`);
  }
};
