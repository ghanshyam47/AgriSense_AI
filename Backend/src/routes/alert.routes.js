import { Router } from 'express';
import { getAlerts, getUnreadCount, markAsRead, deleteAlert } from '../controllers/alert.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getAlerts);
router.get('/unread', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markAsRead);
router.delete('/:id', authenticate, deleteAlert);

export default router;
