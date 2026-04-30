import { Router } from 'express';
import { getForecast, getCurrent, getAgriAlerts } from '../controllers/weather.controller.js';

const router = Router();

router.get('/forecast', getForecast);
router.get('/current', getCurrent);
router.get('/agri-alerts', getAgriAlerts);

export default router;
