import { mlLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { recommend, getCropInfo } from '../controllers/crop.controller.js';


const router = Router();

router.post('/recommend', mlLimiter, recommend);
router.get('/info/:cropName', getCropInfo);

export default router;
