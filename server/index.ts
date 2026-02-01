import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import carbonRoutes from './routes/carbon';
import achievementRoutes from './routes/achievements';
import benchmarkRoutes from './routes/benchmark';
import ecoTipRoutes from './routes/ecoTips';
import uploadRoutes from './routes/upload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/benchmark', benchmarkRoutes);
app.use('/api/tips', ecoTipRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
