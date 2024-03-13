import { Conversation, User, Post } from '../entities';
import AppDataSource from '../configs/db';
import { APIError, Status } from '../types';

export const createConversation = async (
  postId: number,
  sellerId: number,
  buyerId: number,
): Promise<Conversation> => {
  if (sellerId === buyerId) {
    throw new APIError(Status.BAD_REQUEST, 'Seller and buyer cannot be the same user');
  }

  const conversationRepository = AppDataSource.getRepository(Conversation);
  const postRepository = AppDataSource.getRepository(Post);
  const userRepository = AppDataSource.getRepository(User);

  const post = await postRepository.findOneBy({ id: postId });
  if (!post) {
    throw new APIError(Status.NOT_FOUND, `Post with id ${postId} not found`);
  }

  const seller = await userRepository.findOneBy({ id: sellerId });
  if (!seller) {
    throw new APIError(Status.NOT_FOUND, `Seller with id ${sellerId} not found`);
  }

  const buyer = await userRepository.findOneBy({ id: buyerId });
  if (!buyer) {
    throw new APIError(Status.NOT_FOUND, `Buyer with id ${buyerId} not found`);
  }

  const conversation = conversationRepository.create({
    post,
    seller,
    buyer,
  });

  await conversationRepository.save(conversation);
  return conversation;
};

export const getUserConversations = async (userId: number): Promise<Conversation[]> => {
  const conversationRepository = AppDataSource.getRepository(Conversation);

  // Fetch conversations where the user is either the seller or the buyer
  const conversations = await conversationRepository
    .createQueryBuilder('conversation')
    .leftJoinAndSelect('conversation.post', 'post')
    .leftJoinAndSelect('conversation.seller', 'seller')
    .leftJoinAndSelect('conversation.buyer', 'buyer')
    .where('conversation.seller = :userId OR conversation.buyer = :userId', { userId })
    .getMany();

  return conversations;
};

export const getConversationsByPost = async (postId: number): Promise<Conversation[]> => {
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const conversations = await conversationRepository.find({
    where: { post: { id: postId } }, // Update the where condition to match the post relation
    relations: ['post', 'seller', 'buyer'], // Load relations if necessary
  });
  return conversations;
};
