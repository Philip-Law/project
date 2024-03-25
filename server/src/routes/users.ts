import router from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { checkJwt, requireAuth0User } from '../middleware/authentication';
import {
  deleteUser, getUser, setupUser, updateUser,
} from '../services/users';
import { User } from '../entities';
import { Status } from '../types';

const userRoutes = router();

userRoutes.use(checkJwt, requireAuth0User);

const userSchema = z.object({
  phoneNumber: z.string().regex(/^\+[0-9]{10,15}$/, 'Phone number must be a valid E.164 number'),
  major: z.string().regex(/^[A-Za-z ]+$/, 'Major should only include letters'),
  year: z.number().int('Year must be a whole number'),
});

userRoutes.put('/setup', asyncHandler(async (req, res) => {
  const parsedBody = userSchema.parse(req.body);
  const userId = await setupUser(
    new User(0, req.auth0?.id!!, parsedBody.phoneNumber, parsedBody.major, parsedBody.year),
  );
  res.status(Status.CREATED).json({
    id: userId,
    auth0Id: req.auth0?.id!!,
  });
}));

userRoutes.post('/update', asyncHandler(async (req, res) => {
  const parsedBody = userSchema.parse(req.body);
  const user = await updateUser(
    new User(0, req.auth0?.id!!, parsedBody.phoneNumber, parsedBody.major, parsedBody.year),
  );
  res.status(Status.OK).json(user);
}));

userRoutes.get('/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.status(Status.OK).json({
    ...req.auth0!!,
    ...user,
  });
}));

userRoutes.delete('/:id', asyncHandler(async (req, res) => {
  await deleteUser(req.auth0!!, req.params.id);
  res.status(Status.OK);
}));

export default userRoutes;
