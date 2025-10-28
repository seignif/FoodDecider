import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate, registerSchema, loginSchema } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Register new user
router.post('/register', validate(registerSchema), AuthController.register);

// Login user
router.post('/login', validate(loginSchema), AuthController.login);

// Get current user profile (protected route)
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;