import express from 'express';
import { registerUser, loginUser, getMe, changePassword, deleteAccount } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/password', protect, changePassword);
router.post('/delete', protect, deleteAccount);

export default router;
