import { Router } from 'express';
import { translate, processVoice } from '../controllers/voice.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/translate', translate);
router.post('/process', optionalAuth, processVoice);

export default router;
