import express from 'express';
import taskRoutes from './routes/tasks.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middlewares/error.js';

const app = express();
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/', taskRoutes);

app.use(errorHandler);

export default app;
