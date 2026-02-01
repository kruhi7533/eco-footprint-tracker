import mongoose from 'mongoose';

export interface IDailySummary extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    date: Date;
    transportation: number;
    energy: number;
    diet: number;
    waste: number;
    total: number;
    created_at: Date;
    updated_at: Date;
}

const dailySummarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    transportation: {
        type: Number,
        default: 0,
    },
    energy: {
        type: Number,
        default: 0,
    },
    diet: {
        type: Number,
        default: 0,
    },
    waste: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure unique summary per user per date
dailySummarySchema.index({ user: 1, date: 1 }, { unique: true });

const DailySummary = mongoose.model<IDailySummary>('DailySummary', dailySummarySchema);

export default DailySummary;
