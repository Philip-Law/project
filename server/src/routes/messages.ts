import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import { createMessage, getMessagesInConversation } from '../services/messages';
import { Status } from '../types';

const messageRoutes = router();

const conversationIdSchema = z.coerce.number().int('Conversation ID must be an integer').gte(0);

const messageSchema = z.object({
  content: z.string(),
});

// Post a new message to a specific conversation
messageRoutes.post('/:conversationId', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const conversationId = conversationIdSchema.parse(req.params.conversationId);
  const { content } = messageSchema.parse(req.body);
  const senderId = req.auth0!!.id;
  const message = await createMessage(conversationId, senderId, content);
  res.status(Status.CREATED).json(message);
}));

// GET all messages in a specific conversation
messageRoutes.get('/:conversationId', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const conversationId = conversationIdSchema.parse(req.params.conversationId);
  const messages = await getMessagesInConversation(conversationId);
  res.status(Status.OK).json(messages);
}));

export default messageRoutes;
