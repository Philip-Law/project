import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import { setupUser, updateUser } from '../services/users';

const userRoutes = router();

userRoutes.use(checkJwt, requireAuth0User);

const userInfoSchema = z.object({
  major: z.string().regex(/^[A-Za-z ]+$/, 'Major should only include letters'),
  year: z.number().int('Year must be a whole number'),
});

userRoutes.put('/setup', asyncHandler(async (req, res) => {
  const parsedBody = userInfoSchema.parse(req.body);
  const userId = await setupUser(req.auth0?.id!!, parsedBody.major, parsedBody.year);
  res.status(201).json({
    id: userId,
    auth0Id: req.auth0?.id!!,
  });
}));

userRoutes.post('/update', asyncHandler(async (req, res) => {
  const parsedBody = userInfoSchema.parse(req.body);
  const userId = await updateUser(req.auth0?.id!!, parsedBody.major, parsedBody.year);
  res.status(200).json({
    id: userId,
    auth0Id: req.auth0?.id!!,
  });
}));

userRoutes.get('/user/:id', (_req, res) => {
  res.send('returning user info');
});

userRoutes.delete('/user/:id', (_req, res) => {
  res.send('user deleted');
});

export default userRoutes;
