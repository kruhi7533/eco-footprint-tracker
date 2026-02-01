import express from 'express';
import { getAchievementDefinitions, getUserAchievements } from '../controllers/achievementController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/definitions', getAchievementDefinitions); // Publicly accessible maybe? or protected. let's keep it simple.
router.get('/my', protect, getUserAchievements);

export default router;
