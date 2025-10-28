import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Generic validation middleware
export const validate = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: errorMessages,
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    };
};

// Validation schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const questionnaireSchema = z.object({
    wantToCook: z.boolean(),
    timeAvailable: z.number().min(1).max(300),
    budget: z.enum(['low', 'medium', 'high']),
    mealTime: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    dietaryRestrictions: z.array(z.string()).optional(),
});

export const preferenceSchema = z.object({
    dietaryRestrictions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    cuisinePreferences: z.array(z.string()).optional(),
    spiceLevel: z.number().min(1).max(5).optional(),
});