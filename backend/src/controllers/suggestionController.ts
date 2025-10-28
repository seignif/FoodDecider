import { Request, Response } from 'express';
import prisma from '../config/database';
import { IQuestionnaireAnswers, IJWTPayload, ISuggestion } from '../types';

export class SuggestionController {
    // Get meal suggestions based on questionnaire
    static async getSuggestions(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const answers = req.body as IQuestionnaireAnswers;
            const userId = req.user?.userId;

            // Save questionnaire response for analytics
            await prisma.questionnaireResponse.create({
                data: {
                    userId: userId || null,
                    wantToCook: answers.wantToCook,
                    timeAvailable: answers.timeAvailable,
                    budget: answers.budget,
                    mealTime: answers.mealTime,
                },
            });

            // Get user preferences if authenticated
            let userPreferences = null;
            if (userId) {
                userPreferences = await prisma.preference.findUnique({
                    where: { userId },
                });
            }

            // TODO: Implement suggestion algorithm
            // For now, return mock data
            const suggestions: ISuggestion[] = [
                {
                    id: '1',
                    name: 'Spaghetti Carbonara',
                    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
                    type: 'recipe',
                    cookingTime: 25,
                    difficulty: 'Easy',
                    rating: 4.5,
                    budget: answers.budget,
                    description: 'Classic Italian pasta with eggs, cheese, and bacon',
                    url: 'https://example.com/recipe/carbonara',
                },
                {
                    id: '2',
                    name: 'Caesar Salad',
                    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
                    type: 'recipe',
                    cookingTime: 15,
                    difficulty: 'Easy',
                    rating: 4.2,
                    budget: answers.budget,
                    description: 'Fresh romaine lettuce with Caesar dressing',
                    url: 'https://example.com/recipe/caesar-salad',
                },
                {
                    id: '3',
                    name: 'Chicken Stir Fry',
                    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500',
                    type: 'recipe',
                    cookingTime: 20,
                    difficulty: 'Medium',
                    rating: 4.7,
                    budget: answers.budget,
                    description: 'Quick and healthy chicken with vegetables',
                    url: 'https://example.com/recipe/stir-fry',
                },
            ];

            res.status(200).json({
                success: true,
                data: {
                    suggestions,
                    filters: {
                        wantToCook: answers.wantToCook,
                        timeAvailable: answers.timeAvailable,
                        budget: answers.budget,
                        mealTime: answers.mealTime,
                    },
                },
                message: 'Suggestions generated successfully',
            });
        } catch (error) {
            console.error('Get suggestions error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate suggestions',
            });
        }
    }

    // Save a meal to history
    static async saveToHistory(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const { mealType, mealId, mealName, mealImage, cookingTime, budget, rating } = req.body;

            const history = await prisma.history.create({
                data: {
                    userId,
                    mealType,
                    mealId,
                    mealName,
                    mealImage,
                    cookingTime,
                    budget,
                    rating,
                },
            });

            res.status(201).json({
                success: true,
                data: history,
                message: 'Meal saved to history',
            });
        } catch (error) {
            console.error('Save to history error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to save to history',
            });
        }
    }

    // Get user's meal history
    static async getHistory(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const history = await prisma.history.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50, // Limit to last 50 meals
            });

            res.status(200).json({
                success: true,
                data: history,
            });
        } catch (error) {
            console.error('Get history error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get history',
            });
        }
    }
}