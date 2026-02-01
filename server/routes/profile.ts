import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile); // Using PUT for updates, though PATCH is also fine. logic handles partial updates via Object.assign if body is partial.

export default router;
