import { Post } from '../entities';

export const createPost = async (post: Post): Promise<number> => post.id;

export const deletePost = async (postID: number): Promise<number> => postID;
