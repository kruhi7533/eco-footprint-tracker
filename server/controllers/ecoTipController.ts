import { Request, Response } from 'express';
import EcoTip from '../models/EcoTip';

export const getEcoTips = async (req: Request, res: Response) => {
    try {
        const tips = await EcoTip.find();
        res.json(tips);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
