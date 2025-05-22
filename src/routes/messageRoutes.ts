import {Router} from 'express';
import { getChatHistory, sendMessage, searchUsers } from '../controllers/message';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/history/:userId', getChatHistory);
router.post('/send', sendMessage);
router.get('/search', searchUsers);

export default router;