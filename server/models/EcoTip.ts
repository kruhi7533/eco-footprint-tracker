import mongoose from 'mongoose';

const ecoTipSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['transportation', 'energy', 'diet', 'waste'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    impact_level: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const EcoTip = mongoose.model('EcoTip', ecoTipSchema);

export default EcoTip;
