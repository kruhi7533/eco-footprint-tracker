import { Response } from 'express';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            // Update fields
            Object.assign(profile, req.body);

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            // Create if not exists (shouldn't happen usually if registered correctly)
            const newProfile = await Profile.create({
                user: req.user._id,
                ...req.body
            });
            res.json(newProfile);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
