import express from 'express';
import { addCarbonEntry, getDailySummaries, getProgress, getCarbonEntries } from '../controllers/carbonController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, addCarbonEntry);
router.get('/entries', protect, getCarbonEntries);
router.get('/summaries', protect, getDailySummaries);
router.get('/progress', protect, getProgress);

export default router;
