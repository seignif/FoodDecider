import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { IUserCreate, IUserLogin, IJWTPayload } from '../types';

export class AuthController {
    // Register new user
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body as IUserCreate;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            });

            // Generate JWT token
            const jwtSecret = process.env.JWT_SECRET!;
            const signOptions: SignOptions = { expiresIn: '7d' };
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                jwtSecret,
                signOptions
            );

            res.status(201).json({
                success: true,
                data: {
                    user,
                    token,
                },
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to register user',
            });
        }
    }

    // Login user
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as IUserLogin;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid email or password',
                });
                return;
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid email or password',
                });
                return;
            }

            // Generate JWT token
            const jwtSecret = process.env.JWT_SECRET!;
            const signOptions: SignOptions = { expiresIn: '7d' };
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                jwtSecret,
                signOptions
            );

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                    token,
                },
                message: 'Login successful',
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to login',
            });
        }
    }

    // Get current user profile
    static async getProfile(req: Request & { user?: IJWTPayload }, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    preferences: true,
                },
            });

            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get profile',
            });
        }
    }
}