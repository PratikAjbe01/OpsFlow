import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './modules/auth/auth.routes';
import workspaceRoutes from './modules/workspaces/workspace.routes';
import formRoutes from './modules/forms/form.route';
import aiRoutes from './modules/ai/ai.route';
// Load env vars
dotenv.config();
connectDB();
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', //web end point
    credentials: true 
}));
app.use(helmet());
app.use(cookieParser());


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', service: 'OpsFlow API' });
});
app.use('/api/auth',authRoutes)
app.use('/api/workspaces',workspaceRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`🏃‍♀️‍➡️ Server running on http://localhost:${PORT}`);
});