import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types';

// Extend Express Request type
export interface AuthRequest extends Request {
    user?: IJWTPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as IJWTPayload;

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuthMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const jwtSecret = process.env.JWT_SECRET;

            if (jwtSecret) {
                const decoded = jwt.verify(token, jwtSecret) as IJWTPayload;
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        // Continue without user
        next();
    }
};