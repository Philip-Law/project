import { Post } from '../entities';
import AppDataSource from '../configs/db';
import { getUser } from './users';
import { AdType } from '../types/custom';
import LOGGER from '../configs/logging';

interface CreatePostRequest {
  title: string;
  adType: AdType;
  description: string;
  location: string;
  categories: string[];
  price: number;
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
    .createQueryBuilder()
    .where('id = :id', { id: postID })
    .getOne();

  if (!post) {
    throw new Error(`Post with id ${postID} does not exist`);
  }
  return post;
};

export const deletePost = async (auth0Id: string, postID: number): Promise<void> => {
  const user = await getUser(auth0Id);
  const post = await getPost(postID);

  if (user.id !== post.user.id) {
    throw new Error('User does not have permission to delete this post');
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
