import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One profile per user
    },
    name: String,
    email: String,
    avatar_url: String,
    joined_date: {
        type: Date,
        default: Date.now,
    },
    level: {
        type: Number,
        default: 1,
    },
    eco_points: {
        type: Number,
        default: 0,
    },
    consecutive_days: {
        type: Number,
        default: 0,
    },
    transportation_reductions: {
        type: Number,
        default: 0,
    },
    energy_savings: {
        type: Number,
        default: 0,
    },
    waste_reduction: {
        type: Number,
        default: 0,
    },
    measurement_unit: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric',
    },
    language: {
        type: String,
        enum: ['en', 'es', 'fr'],
        default: 'en',
    },
    notifications_enabled: {
        type: Boolean,
        default: true,
    },
    data_sharing_enabled: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
