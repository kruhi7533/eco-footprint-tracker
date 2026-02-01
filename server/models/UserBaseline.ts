import mongoose from 'mongoose';

const userBaselineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    transportation_emissions: {
        type: Number,
        default: 1000,
    },
    energy_emissions: {
        type: Number,
        default: 800,
    },
    diet_emissions: {
        type: Number,
        default: 600,
    },
    waste_emissions: {
        type: Number,
        default: 300,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UserBaseline = mongoose.model('UserBaseline', userBaselineSchema);

export default UserBaseline;
