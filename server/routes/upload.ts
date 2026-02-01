import express from 'express';
import { uploadAvatar } from '../controllers/uploadController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, uploadAvatar);

export default router;
