import router from 'express';
import { checkJwt, requireAuth0User } from '../middleware/authentication';

const messageRoutes = router();

messageRoutes.get('/:conversation_id', checkJwt, requireAuth0User(), (req, res) => {
  res.send('all messages associated to a conversation');
});

export default messageRoutes;
