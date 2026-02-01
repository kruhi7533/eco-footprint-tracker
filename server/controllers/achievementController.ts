import { Response } from 'express';
import { AchievementDefinition, UserAchievement } from '../models/Achievement';
import { AuthRequest } from '../middleware/auth';

export const getAchievementDefinitions = async (req: AuthRequest, res: Response) => {
    try {
        const definitions = await AchievementDefinition.find({}).sort({ level: 1, points: -1 });
        res.json(definitions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserAchievements = async (req: AuthRequest, res: Response) => {
    try {
        const achievements = await UserAchievement.find({ user: req.user._id }).sort({ earned_at: -1 });
        res.json(achievements);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
