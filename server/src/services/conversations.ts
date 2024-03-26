import { Conversation } from '../entities';
import AppDataSource from '../configs/db';
import { APIError, Status } from '../types';
import { getUser } from './users';
import { getPost } from './posts';
import LOGGER from '../configs/logging';

export const createConversation = async (
  postId: number,
  sellerId: string, // auth0 id
  buyerId: string, // auth0 id
): Promise<Conversation> => {
  if (sellerId === buyerId) {
    throw new APIError(Status.BAD_REQUEST, 'Seller and buyer cannot be the same user');
  }

  const conversationRepository = AppDataSource.getRepository(Conversation);

  const post = await getPost(postId);
  if (!post) {
    LOGGER.info(`Post with id ${postId} not found`);
  }

  const seller = await getUser(sellerId);
  if (!seller) {
    LOGGER.info(`Seller with id ${sellerId} not found`);
  }

  const buyer = await getUser(buyerId);
  if (!buyer) {
    LOGGER.info(`Buyer with id ${buyerId} not found`);
  }

  const conversation = conversationRepository.create({
    post,
    seller,
    buyer,
  });

  await conversationRepository.save(conversation);
  return conversation;
};

export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
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

export const getConversationById = async (conversationId: number): Promise<Conversation> => {
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const conversation = await conversationRepository.findOneBy({ id: conversationId });
  if (!conversation) {
    throw new APIError(Status.NOT_FOUND, `Conversation with ID ${conversationId} not found`);
  }
  return conversation;
};

export const getConversationsByPost = async (postId: number): Promise<Conversation[]> => {
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const conversations = await conversationRepository.find({
    where: { post: { id: postId } }, // Update the where condition to match the post relation
    relations: ['post', 'seller', 'buyer'], // Load relations if necessary
  });
  return conversations;
};
