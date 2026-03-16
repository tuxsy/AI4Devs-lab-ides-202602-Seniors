import request from 'supertest';

const mockFindFirst = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findFirst: mockFindFirst,
    },
    $queryRaw: jest.fn(),
  })),
}));

// Import app AFTER the mock is in place
import { app } from '../index';

describe('GET /autologin', () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
  });

  it('returns 200 with user data when users exist', async () => {
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@example.com',
      name: 'Test User',
    };
    mockFindFirst.mockResolvedValueOnce(mockUser);

    const res = await request(app).get('/autologin');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it('response contains id, email, and name fields', async () => {
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@lti.com',
      name: 'Admin User',
    };
    mockFindFirst.mockResolvedValueOnce(mockUser);

    const res = await request(app).get('/autologin');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('name');
    expect(typeof res.body.id).toBe('string');
    expect(typeof res.body.email).toBe('string');
  });

  it('returns 404 when no users exist', async () => {
    mockFindFirst.mockResolvedValueOnce(null);

    const res = await request(app).get('/autologin');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: 'NotFound',
      message: 'No users found',
    });
  });

  it('returns Content-Type application/json', async () => {
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@example.com',
      name: 'Test User',
    };
    mockFindFirst.mockResolvedValueOnce(mockUser);

    const res = await request(app).get('/autologin');

    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
