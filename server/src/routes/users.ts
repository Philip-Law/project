import router from 'express';
import { checkJwt } from '../authentication';

const userRoutes = router();

userRoutes.put('/setup', (_req, res) => {
  res.send('user is setup/created');
});

userRoutes.post('/update/:id', checkJwt, (_req, res) => {
  res.send('user info is changed');
});

userRoutes.get('/user/:id', checkJwt, (_req, res) => {
  res.send('returning user info');
});

userRoutes.delete('/user/:id', checkJwt, (_req, res) => {
  res.send('user deleted');
});

export default userRoutes;
