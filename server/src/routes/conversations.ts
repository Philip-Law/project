import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import * as ConversationService from '../services/conversations';
import { Status } from '../types';
import { Conversation } from '../entities';

const conversationRoutes = Router();

const postIdSchema = z.coerce.number().int().min(1, 'Post ID must be a positive integer');

const toConversationResponse = (conversation: Conversation) => ({
  id: conversation.id,
  postId: conversation.post.id,
  buyerId: conversation.buyer.id,
  sellerId: conversation.seller.id,
});

// Route to create a new conversation for a post with the current user and the post's seller.
conversationRoutes.post('/:postId', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const postId = postIdSchema.parse(req.params.postId);
  const buyerId = req.auth0!!.id;
  const conversation = await ConversationService.createConversation(postId, buyerId);
  res.status(Status.CREATED).json(toConversationResponse(conversation));
}));

// Route to get all conversations for a user
conversationRoutes.get('/user', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const conversations = await ConversationService.getUserConversations(req.auth0!!.id);
  res.status(Status.OK).json(conversations.map(toConversationResponse));
}));

// Get a conversation for a post that the user is a part of.
conversationRoutes.get('/post/:postId', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const postId = postIdSchema.parse(req.params.postId);
  const conversation = await ConversationService.getConversationByPost(postId, req.auth0!!.id);
  res.status(Status.OK).json(toConversationResponse(conversation));
}));

export default conversationRoutes;
