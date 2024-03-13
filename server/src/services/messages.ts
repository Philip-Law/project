import { Message, Conversation, User } from '../entities';
import AppDataSource from '../configs/db';
import { APIError, Status } from '../types';

export const createMessage = async (
  conversationId: number,
  senderId: number,
  content: string,
): Promise<Message> => {
  const messageRepository = AppDataSource.getRepository(Message);
  const conversationRepository = AppDataSource.getRepository(Conversation);
  const userRepository = AppDataSource.getRepository(User);

  // Validate if the conversation exists
  const conversation = await conversationRepository.findOneBy({ id: conversationId });
  if (!conversation) {
    throw new APIError(Status.NOT_FOUND, `Conversation with ID ${conversationId} not found`);
  }

  // Validate if the sender exists
  const sender = await userRepository.findOneBy({ id: senderId });
  if (!sender) {
    throw new APIError(Status.NOT_FOUND, `User with ID ${senderId} not found`);
  }

  // Create the message
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
