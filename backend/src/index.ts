import { Request, Response, NextFunction } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import healthRouter from './routes/health';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Security headers — first middleware
app.use(helmet({ frameguard: { action: 'deny' } }));

// CORS — restricted to ALLOWED_ORIGIN env var
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));

// Body parsing — 1 MB limit
app.use(express.json({ limit: '1mb' }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hola LTI!');
});

// Health check route
app.use('/health', healthRouter);

interface ApiError extends Error {
  statusCode?: number;
}

// Centralized error handler — must be last middleware (4-arg signature)
app.use((err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const error = statusCode >= 500 ? 'InternalServerError' : 'BadRequest';
  const message =
    statusCode >= 500 ? 'An unexpected error occurred' : err.message;
  res.status(statusCode).json({ error, message });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
