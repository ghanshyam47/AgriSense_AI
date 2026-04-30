import { mlLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { sendMessage, getHistory, clearHistory } from '../controllers/chat.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';


const router = Router();

router.post('/message', optionalAuth, mlLimiter, sendMessage);
router.get('/history', optionalAuth, getHistory);
router.delete('/history', optionalAuth, clearHistory);

export default router;
