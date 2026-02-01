import mongoose from 'mongoose';

const achievementDefinitionSchema = new mongoose.Schema({
    achievement_id: { type: String, required: true, unique: true },
    title: String,
    description: String,
    icon_name: String,
    category: String,
    threshold: Number,
    unit: String,
    level: Number,
    points: Number,
    requirements: {
        type: mongoose.Schema.Types.Mixed, // Storing JSON structure for requirements
    },
}, { timestamps: true });

export const AchievementDefinition = mongoose.model('AchievementDefinition', achievementDefinitionSchema);

const userAchievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    achievement_id: {
        type: String,
        required: true,
    },
    earned_at: {
        type: Date,
        default: Date.now,
    },
});

export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
