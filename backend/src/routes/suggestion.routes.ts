import { Router } from 'express';
import { SuggestionController } from '../controllers/suggestionController';
import { validate, questionnaireSchema } from '../middlewares/validation.middleware';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Get meal suggestions (works with or without auth)
router.post('/generate', optionalAuthMiddleware, validate(questionnaireSchema), SuggestionController.getSuggestions);

// Save meal to history (requires auth)
router.post('/history', authMiddleware, SuggestionController.saveToHistory);

// Get user's meal history (requires auth)
router.get('/history', authMiddleware, SuggestionController.getHistory);

export default router;