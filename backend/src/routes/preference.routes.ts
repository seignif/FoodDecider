import { Router } from 'express';
import { PreferenceController } from '../controllers/preferenceController';
import { validate, preferenceSchema } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All preference routes require authentication

// Get user preferences
router.get('/', authMiddleware, PreferenceController.getPreferences);

// Create or update preferences
router.put('/', authMiddleware, validate(preferenceSchema), PreferenceController.updatePreferences);

// Delete preferences
router.delete('/', authMiddleware, PreferenceController.deletePreferences);

export default router;