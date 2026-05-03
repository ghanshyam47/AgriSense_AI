import { Router } from 'express';
import { 
  translate, 
  processVoice, 
  twilioIncomingCall, 
  twilioProcessSpeech, 
  twilioProcessAI 
} from '../controllers/voice.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/translate', translate);
router.post('/process', optionalAuth, processVoice);

// Twilio Webhooks
router.post('/twilio/incoming', twilioIncomingCall);
router.post('/twilio/process', twilioProcessSpeech);
router.post('/twilio/process-ai', twilioProcessAI);

export default router;
