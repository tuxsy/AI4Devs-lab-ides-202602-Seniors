import request from 'supertest';

const mockQueryRaw = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $queryRaw: mockQueryRaw,
  })),
}));

// Import app AFTER the mock is in place
import { app } from '../index';

describe('GET /health', () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it('returns 200 with { status: "ok" } shape when DB is reachable', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toEqual({ status: 'ok' });
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('returns 503 with { status: "degraded" } when DB is unreachable', async () => {
    mockQueryRaw.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.db).toEqual({ status: 'unreachable' });
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('returns Content-Type application/json', async () => {
    mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    const res = await request(app).get('/health');

    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
