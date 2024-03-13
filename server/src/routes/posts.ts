import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import {
  createPost, deletePost, getPost, getPostsByQuery,
} from '../services/posts';
import { AdType, Status } from '../types';

const postRoutes = router();

const postIdSchema = z.number().int('ID must be an integer').gte(0);

const postQuerySchema = z.object({
  category: z.string().optional().transform((value) => value?.split(',') || []),
  adType: z.nativeEnum(AdType).optional(),
  location: z.string().optional(),
  title: z.string().optional(),
});

const postSchema = z.object({
  title: z.string({ description: 'Title must be a string' }).max(200, 'Title must be no more than 200 characters'),
  adType: z.nativeEnum(AdType),
  description: z.string(),
  location: z.string(),
  categories: z.array(z.string()),
  price: z.number().gte(0, 'Price must be a dollar amount '),
});

postRoutes.get('/', asyncHandler(async (req, res) => {
  const queryParams = postQuerySchema.parse(req.query);
  const posts = await getPostsByQuery(queryParams);
  res.status(Status.OK).json(posts);
}));

postRoutes.get('/details/:id', asyncHandler(async (req, res) => {
  const id = postIdSchema.parse(req.params.id);
  const post = await getPost(id);
  res.status(Status.OK).json(post);
}));

postRoutes.post('/', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const postReq = postSchema.parse(req.body);
  const postId = await createPost(req.auth0?.id!!, postReq);
  res.status(Status.CREATED).json({
    postId,
  });
}));

postRoutes.delete('/:id', checkJwt, requireAuth0User, asyncHandler(async (req, res) => {
  const id = postIdSchema.parse(req.params.id);
  await deletePost(req.auth0?.id!!, id);
  res.status(Status.OK);
}));

export default postRoutes;
