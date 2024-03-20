import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import multer from 'multer';
import path from 'node:path';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import {
  createPost, deletePost, getPost, getPostsByQuery,
} from '../services/posts';
import { AdType, APIError, Status } from '../types';
import {getImageURLs, uploadImages} from '../services/file_store';

const postRoutes = router();

const postIdSchema = z.coerce.number().int().min(1, 'Post ID must be a positive integer');

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

postRoutes.post(
  '/image/upload/:id',
  checkJwt,
  requireAuth0User,
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
    fileFilter: (req, file, callback) => {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (!extname) {
        callback(new APIError(Status.BAD_REQUEST, 'Only images (jpeg, jpg, png) are allowed.'));
      } else {
        callback(null, true);
      }
    },
  }).array('post-images', 5),
  checkJwt,
  requireAuth0User,
  asyncHandler(async (req, res) => {
    const id = postIdSchema.parse(req.params.id);
    const images = req.files as Express.Multer.File[];
    await uploadImages(id, req.auth0?.id!!, images);
    res.status(Status.OK).send();
  }),
);

postRoutes.get('/image/:id', asyncHandler(async (req, res) => {
  const id = postIdSchema.parse(req.params.id);
  const images = await getImageURLs(id);
  res.status(Status.OK).json(images);
}));

export default postRoutes;
