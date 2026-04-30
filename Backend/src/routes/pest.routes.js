import { mlLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';
import { detect, getCommonPests } from '../controllers/pest.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';


const router = Router();

router.post('/detect', uploadImage, mlLimiter, detect);
router.get('/common/:crop', getCommonPests);

export default router;
