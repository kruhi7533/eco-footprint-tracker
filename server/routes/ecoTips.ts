import express from 'express';
import { getEcoTips } from '../controllers/ecoTipController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getEcoTips);

export default router;
