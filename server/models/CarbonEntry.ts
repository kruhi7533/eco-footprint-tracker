import mongoose from 'mongoose';

const carbonEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        enum: ['transportation', 'energy', 'diet', 'waste'],
        required: true,
    },
    activity_type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    emissions: {
        type: Number,
        required: true,
    },
    notes: String,
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const CarbonEntry = mongoose.model('CarbonEntry', carbonEntrySchema);

export default CarbonEntry;
