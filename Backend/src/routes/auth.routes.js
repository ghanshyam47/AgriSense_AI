import { authLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { getProfile, updateProfile, updateFarmProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';


const router = Router();


router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);
router.put('/farm', authenticate, updateFarmProfile);

export default router;
