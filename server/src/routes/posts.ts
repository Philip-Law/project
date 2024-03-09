import router from 'express';
import asyncHandler from 'express-async-handler';
import { requireAuth0User } from '../middleware/authentication';

const postRoutes = router();

postRoutes.get('/', (_req, res) => {
  res.send('returned up to 10 posts based on query parameters');
});

postRoutes.get('/:id', (_req, res) => {
  res.send('get complete post details for specific post');
});

postRoutes.post('/', requireAuth0User, asyncHandler(async (_req, res) => {
  res.send('post created');
}));

postRoutes.delete('/:id', requireAuth0User, (_req, res) => {
  res.send('post deleted');
});

export default postRoutes;
