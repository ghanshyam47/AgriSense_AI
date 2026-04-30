import { alertService } from '../services/alert.service.js';

export const getAlerts = async (req, res, next) => {
  try {
    const { type, limit } = req.query;
    const alerts = await alertService.getUserAlerts(req.user._id, { type, limit: parseInt(limit) || 50 });
    res.json({ success: true, data: alerts });
  } catch (err) { next(err); }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await alertService.getUnreadCount(req.user._id);
    res.json({ success: true, unread: count });
  } catch (err) { next(err); }
};

export const markAsRead = async (req, res, next) => {
  try {
    const alert = await alertService.markAsRead(req.params.id, req.user._id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true, data: alert });
  } catch (err) { next(err); }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await alertService.deleteAlert(req.params.id, req.user._id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (err) { next(err); }
};
