import express from 'express';
import { getBenchmarkData } from '../controllers/benchmarkController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getBenchmarkData);

export default router;
