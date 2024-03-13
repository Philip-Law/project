import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import { createPost, deletePost } from '../services/posts';
import { AdType, Status } from '../types';

const postRoutes = router();

postRoutes.get('/', (_req, res) => {
  res.send('returned up to 10 posts based on query parameters');
});

postRoutes.get('/:id', (_req, res) => {
  res.send('get complete post details for specific post');
});

const postSchema = z.object({
  title: z.string({ description: 'Title must be a string' }).max(200, 'Title must be no more than 200 characters'),
  adType: z.nativeEnum(AdType),
  description: z.string(),
  location: z.string(),
  categories: z.array(z.string()),
  price: z.number().gte(0, 'Price must be a dollar amount '),
});

postRoutes.post('/', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const postReq = postSchema.parse(req.body);
  const postId = await createPost(req.auth0?.id!!, postReq);
  res.status(Status.CREATED).json({
    postId,
  });
}));

postRoutes.delete('/:id', requireAuth0User, asyncHandler(async (req, res) => {
  const postIdSchema = z.number().int('ID must be an integer').gte(0);
  const id = postIdSchema.parse(req.params.id);
  await deletePost(req.auth0?.id!!, id);
  res.status(Status.OK);
}));

export default postRoutes;
