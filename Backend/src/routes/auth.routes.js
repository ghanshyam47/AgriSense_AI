import { authLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { getProfile, updateProfile, updateFarmProfile, createFarm, deleteFarm } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';


const router = Router();


router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);
router.post('/farms', authenticate, createFarm);
router.put('/farm', authenticate, updateFarmProfile);
router.delete('/farms/:farmId', authenticate, deleteFarm);

export default router;
