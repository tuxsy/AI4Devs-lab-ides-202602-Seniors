import { Request, Response } from 'express';
import { Router } from 'express';
import prisma from '../index';

const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  let dbStatus: 'ok' | 'unreachable' = 'ok';

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unreachable';
  }

  if (dbStatus === 'ok') {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: { status: 'ok' },
    });
  } else {
    res.status(503).json({
      status: 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: { status: 'unreachable' },
    });
  }
});

export default healthRouter;
