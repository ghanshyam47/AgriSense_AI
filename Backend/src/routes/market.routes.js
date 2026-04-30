import { Router } from 'express';
import { getPrices, getMSP, getTrend, getAdvice } from '../controllers/market.controller.js';

const router = Router();

router.get('/prices/:crop', getPrices);
router.get('/msp/:crop', getMSP);
router.get('/trend/:crop', getTrend);
router.get('/advice/:crop', getAdvice);

export default router;
