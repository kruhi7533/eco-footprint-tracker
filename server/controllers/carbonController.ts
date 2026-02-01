import { Response } from 'express';
import CarbonEntry from '../models/CarbonEntry';
import DailySummary from '../models/DailySummary';
import UserBaseline from '../models/UserBaseline';
import { AuthRequest } from '../middleware/auth';

export const addCarbonEntry = async (req: AuthRequest, res: Response) => {
    try {
        const entry = await CarbonEntry.create({
            user: req.user._id,
            ...req.body,
        });

        // Update Daily Summary
        const date = new Date(req.body.date);
        date.setHours(0, 0, 0, 0); // Normalize to midnight

        const emissions = Number(req.body.emissions);
        const category = req.body.category;

        // Find existing summary or create new one
        let summary = await DailySummary.findOne({
            user: req.user._id,
            date: date
        });

        if (!summary) {
            summary = new DailySummary({
                user: req.user._id,
                date: date,
                transportation: 0,
                energy: 0,
                diet: 0,
                waste: 0,
                total: 0
            });
        }

        if (category === 'transportation') summary.transportation += emissions;
        if (category === 'energy') summary.energy += emissions;
        if (category === 'diet') summary.diet += emissions;
        if (category === 'waste') summary.waste += emissions;
        summary.total += emissions;

        await summary.save();

        res.status(201).json(entry);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDailySummaries = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        // Build query
        const query: any = { user: req.user._id };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }

        const summaries = await DailySummary.find(query).sort({ date: 1 });
        res.json(summaries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProgress = async (req: AuthRequest, res: Response) => {
    try {
        // 1. Get or create baseline
        let baseline = await UserBaseline.findOne({ user: req.user._id });
        if (!baseline) {
            baseline = await UserBaseline.create({ user: req.user._id });
        }

        // 2. Get daily summaries for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const summaries = await DailySummary.find({
            user: req.user._id,
            date: { $gte: sevenDaysAgo }
        });

        // 3. Calculate averages
        let avgTransport = 0;
        let avgEnergy = 0;
        let avgDiet = 0;
        let avgWaste = 0;

        if (summaries.length > 0) {
            const totalTransport = summaries.reduce((sum, s) => sum + s.transportation, 0);
            const totalEnergy = summaries.reduce((sum, s) => sum + s.energy, 0);
            const totalDiet = summaries.reduce((sum, s) => sum + s.diet, 0);
            const totalWaste = summaries.reduce((sum, s) => sum + s.waste, 0);

            avgTransport = totalTransport / summaries.length;
            avgEnergy = totalEnergy / summaries.length;
            avgDiet = totalDiet / summaries.length;
            avgWaste = totalWaste / summaries.length;
        }

        // 4. Format response
        const categories = [
            { key: 'transportation', avg: avgTransport, baseline: baseline.transportation_emissions },
            { key: 'energy', avg: avgEnergy, baseline: baseline.energy_emissions },
            { key: 'diet', avg: avgDiet, baseline: baseline.diet_emissions },
            { key: 'waste', avg: avgWaste, baseline: baseline.waste_emissions },
        ];

        const progressData = categories.map(cat => {
            const reduction = cat.baseline - cat.avg;
            const percentage = cat.baseline > 0 ? (reduction / cat.baseline) * 100 : 0;

            return {
                category: cat.key,
                current_emissions: cat.avg,
                baseline_emissions: cat.baseline,
                reduction: reduction,
                percentage: percentage
            };
        });


        res.json(progressData);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCarbonEntries = async (req: AuthRequest, res: Response) => {
    try {
        const { limit } = req.query;
        let query = CarbonEntry.find({ user: req.user._id }).sort({ created_at: -1 });

        if (limit) {
            query = query.limit(Number(limit));
        }

        const entries = await query;
        res.json(entries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
