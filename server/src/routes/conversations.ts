import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { requireAuth0User } from '../middleware/authentication';
import * as ConversationService from '../services/conversations';
import * as MessageService from '../services/messages';

const conversationRoutes = Router();

// Route to create a new conversation
conversationRoutes.post('/', requireAuth0User, asyncHandler(async (req, res) => {
  const { postId, sellerId, buyerId } = req.body;
  const conversation = await ConversationService.createConversation(postId, sellerId, buyerId);
  res.json(conversation);
}));

// Route to get all conversations for a user
conversationRoutes.get('/user/:userId', requireAuth0User, asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming the user's ID is provided in the URL
  const conversations = await ConversationService.getUserConversations(userId);
  res.json(conversations);
}));

// Route to get all messages in a specific conversation
conversationRoutes.get('/:conversationId/messages', requireAuth0User, asyncHandler(async (req, res) => {
  const { conversationId } = req.params; // Assuming the conversation's ID is provided in the URL
  const messages = await MessageService.getMessagesInConversation(parseInt(conversationId, 10));
  res.json(messages);
}));

export default conversationRoutes;
