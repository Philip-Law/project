import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import { createMessage } from '../services/messages';
import { Status } from '../types';

const messageRoutes = router();

const conversationIdSchema = z.number().int('Conversation ID must be an integer').gte(0);

const messageSchema = z.object({
  senderId: z.string(),
  content: z.string(),
});

messageRoutes.get('/:conversation_id', checkJwt, requireAuth0User, (req, res) => {
  res.send('all messages associated to a conversation');
});

// Post a new message to a specific conversation
messageRoutes.post('/:conversationId', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const conversationId = conversationIdSchema.parse(parseInt(req.params.conversationId, 10));
  const { senderId, content } = messageSchema.parse(req.body);
  const message = await createMessage(conversationId, senderId, content);
  res.status(Status.CREATED).json(message);
}));

export default messageRoutes;
