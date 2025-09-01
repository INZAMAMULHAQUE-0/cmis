import express from 'express';
import { body } from 'express-validator';
import { register, login, me, logout, refresh } from '../controllers/auth.controller.js';
import { getUsersByRole } from '../controllers/auth.controller.js';
import { sendWelcomeEmail } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users by role
router.get('/users', getUsersByRole);

router.post(
	'/register',
	[body('email').isEmail(), body('password').isLength({ min: 6 })],
	register
);

router.post('/login', [body('email').isEmail(), body('password').exists()], login);

router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);
router.post('/send-welcome', authMiddleware, sendWelcomeEmail);
router.post('/refresh', refresh);

export default router;
