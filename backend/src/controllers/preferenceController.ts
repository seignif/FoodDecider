import { Request, Response } from 'express';
import prisma from '../config/database';
import { IPreferenceCreate, IJWTPayload } from '../types';

export class PreferenceController {
    // Get user preferences
    static async getPreferences(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const preferences = await prisma.preference.findUnique({
                where: { userId },
            });

            res.status(200).json({
                success: true,
                data: preferences,
            });
        } catch (error) {
            console.error('Get preferences error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get preferences',
            });
        }
    }

    // Create or update user preferences
    static async updatePreferences(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const data = req.body as IPreferenceCreate;

            // Check if preferences already exist
            const existingPreferences = await prisma.preference.findUnique({
                where: { userId },
            });

            let preferences;

            if (existingPreferences) {
                // Update existing preferences
                preferences = await prisma.preference.update({
                    where: { userId },
                    data: {
                        dietaryRestrictions: data.dietaryRestrictions || existingPreferences.dietaryRestrictions,
                        allergies: data.allergies || existingPreferences.allergies,
                        cuisinePreferences: data.cuisinePreferences || existingPreferences.cuisinePreferences,
                        spiceLevel: data.spiceLevel !== undefined ? data.spiceLevel : existingPreferences.spiceLevel,
                    },
                });
            } else {
                // Create new preferences
                preferences = await prisma.preference.create({
                    data: {
                        userId,
                        dietaryRestrictions: data.dietaryRestrictions || [],
                        allergies: data.allergies || [],
                        cuisinePreferences: data.cuisinePreferences || [],
                        spiceLevel: data.spiceLevel || 2,
                    },
                });
            }

            res.status(200).json({
                success: true,
                data: preferences,
                message: 'Preferences updated successfully',
            });
        } catch (error) {
            console.error('Update preferences error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update preferences',
            });
        }
    }

    // Delete user preferences
    static async deletePreferences(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            await prisma.preference.delete({
                where: { userId },
            });

            res.status(200).json({
                success: true,
                message: 'Preferences deleted successfully',
            });
        } catch (error) {
            console.error('Delete preferences error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete preferences',
            });
        }
    }
}