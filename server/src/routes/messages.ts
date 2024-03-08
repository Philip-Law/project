import router from 'express';
import { checkJwt } from '../authentication';

const messageRoutes = router();

messageRoutes.get('/:conversation_id', checkJwt, (req, res) => {
  res.send('all messages associated to a conversation');
});

export default messageRoutes;
