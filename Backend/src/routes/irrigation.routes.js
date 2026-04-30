import { mlLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { plan, getToday } from '../controllers/irrigation.controller.js';


const router = Router();

router.post('/plan', mlLimiter, plan);
router.get('/today', getToday);

export default router;
