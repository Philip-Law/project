import { Message, Conversation } from '../entities';
import AppDataSource from '../configs/db';
import { APIError, Status } from '../types';
import { getUser } from './users';

export const createMessage = async (
  conversationId: number,
  senderId: string, // this is an auth0 id string
  content: string,
): Promise<Message> => {
  // Validate if the conversation exists
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const conversation = await conversationRepository.findOneBy({ id: conversationId });
  if (!conversation) {
    throw new APIError(Status.NOT_FOUND, `Conversation with ID ${conversationId} not found`);
  }

  // Validate if the sender exists
  const sender = await getUser(senderId);
  if (!sender) {
    throw new APIError(Status.NOT_FOUND, `User with ID ${senderId} not found`);
  }

  // Create the message
  const messageRepository = AppDataSource.getRepository(Message);
  const message = messageRepository.create({
    conversation, // Use the retrieved conversation entity
    sender, // Use the retrieved sender (user) entity
    content,
  });

  await messageRepository.save(message);
  return message;
};

export const getMessagesInConversation = async (
  conversationId: number,
): Promise<Message[]> => {
  const messageRepository = AppDataSource.getRepository(Message);
  const messages = await messageRepository.find({
    where: { conversation: { id: conversationId } },
    relations: ['conversation', 'sender'], // Include relations if needed
  });

  if (!messages) {
    throw new APIError(Status.NOT_FOUND, `No messages found for conversation with ID ${conversationId}`);
  }

  return messages;
};
