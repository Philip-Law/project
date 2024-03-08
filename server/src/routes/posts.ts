import router from 'express';
import asyncHandler from 'express-async-handler';
import { checkJwt } from '../authentication';

const postRoutes = router();

postRoutes.get('/', (_req, res) => {
  res.send('returned up to 10 posts based on query parameters');
});

postRoutes.get('/:id', (_req, res) => {
  res.send('get complete post details for specific post');
});

postRoutes.post('/', checkJwt, asyncHandler(async (_req, res) => {
  res.send('post created');
}));

postRoutes.delete('/:id', checkJwt, (_req, res) => {
  res.send('post deleted');
});

export default postRoutes;
