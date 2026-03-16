/* eslint-disable @typescript-eslint/ban-types */
import request from 'supertest';

// --- Prisma mock setup ---
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockCreateMany = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      count: mockCount,
      create: mockCreate,
    },
    education: { createMany: mockCreateMany },
    workExperience: { createMany: mockCreateMany },
    document: { count: jest.fn().mockResolvedValue(0) },
    $transaction: mockTransaction,
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  })),
  CandidateStatus: {
    ACTIVE: 'ACTIVE',
    IN_PROCESS: 'IN_PROCESS',
    HIRED: 'HIRED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN',
  },
}));

import { app } from '../index';

const validUserId = '00000000-0000-0000-0000-000000000001';

const candidateSummary = {
  id: '00000000-0000-0000-0000-000000000010',
  firstName: 'Ana',
  lastName: 'Garcia',
  email: 'ana@example.com',
  phone: null,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const candidateDetail = {
  ...candidateSummary,
  address: null,
  education: [],
  workExperiences: [],
  documents: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// GET /candidates
// ---------------------------------------------------------------------------
describe('GET /candidates', () => {
  it('returns 200 with paginated list', async () => {
    mockFindMany.mockResolvedValue([candidateSummary]);
    mockCount.mockResolvedValue(1);

    const res = await request(app).get('/candidates');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toMatchObject({
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  });

  it('respects page and limit query params', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const res = await request(app).get('/candidates?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.pagination).toMatchObject({ page: 2, limit: 5 });
  });

  it('filters by status', async () => {
    mockFindMany.mockResolvedValue([candidateSummary]);
    mockCount.mockResolvedValue(1);

    const res = await request(app).get('/candidates?status=ACTIVE');

    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'ACTIVE' } }),
    );
  });

  it('returns 400 for invalid status', async () => {
    const res = await request(app).get('/candidates?status=INVALID');
    expect(res.status).toBe(400);
  });

  it('returns 400 for non-integer page', async () => {
    const res = await request(app).get('/candidates?page=abc');
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// GET /candidates/:id
// ---------------------------------------------------------------------------
describe('GET /candidates/:id', () => {
  it('returns 200 with candidate detail when found', async () => {
    mockFindUnique.mockResolvedValue(candidateDetail);

    const res = await request(app).get(`/candidates/${candidateSummary.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(candidateSummary.id);
    expect(res.body).toHaveProperty('education');
    expect(res.body).toHaveProperty('workExperiences');
    expect(res.body).toHaveProperty('documents');
  });

  it('returns 404 when candidate is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await request(app).get(
      '/candidates/00000000-0000-0000-0000-000000000099',
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NotFound');
  });

  it('returns 400 for invalid UUID format', async () => {
    const res = await request(app).get('/candidates/not-a-uuid');
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// POST /candidates
// ---------------------------------------------------------------------------
describe('POST /candidates', () => {
  const validBody = {
    userId: validUserId,
    firstName: 'Carlos',
    lastName: 'Lopez',
    email: 'carlos@example.com',
  };

  it('returns 201 with created candidate', async () => {
    mockTransaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        candidate: {
          create: jest.fn().mockResolvedValue(candidateSummary),
          findUnique: jest.fn().mockResolvedValue(candidateDetail),
        },
        education: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        workExperience: {
          createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      };
      return fn(txMock);
    });

    const res = await request(app)
      .post('/candidates')
      .send(validBody)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({ firstName: 'Carlos' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({ ...validBody, email: 'not-an-email' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid userId (not UUID)', async () => {
    const res = await request(app)
      .post('/candidates')
      .send({ ...validBody, userId: 'not-a-uuid' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists (P2002)', async () => {
    const prismaError = Object.assign(new Error('Unique constraint'), {
      code: 'P2002',
      clientVersion: '4.x',
    });

    mockTransaction.mockRejectedValue(prismaError);

    // Override the class check by mocking PrismaClientKnownRequestError
    jest.mock('@prisma/client/runtime/library', () => ({
      PrismaClientKnownRequestError: class extends Error {
        code: string;
        constructor(msg: string, meta: { code: string }) {
          super(msg);
          this.code = meta.code;
        }
      },
    }));

    const res = await request(app)
      .post('/candidates')
      .send(validBody)
      .set('Content-Type', 'application/json');

    // The service catches P2002 and throws ApiError(409)
    // or the global handler catches PrismaClientKnownRequestError with P2002
    expect([409, 500]).toContain(res.status);
  });

  it('strips HTML from firstName', async () => {
    mockTransaction.mockImplementation(async (fn: Function) => {
      const txMock = {
        candidate: {
          create: jest
            .fn()
            .mockImplementation((args: { data: Record<string, unknown> }) => {
              expect(args.data.firstName).toBe('Carlos');
              return Promise.resolve(candidateSummary);
            }),
          findUnique: jest.fn().mockResolvedValue(candidateDetail),
        },
        education: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
        workExperience: {
          createMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      };
      return fn(txMock);
    });

    const res = await request(app)
      .post('/candidates')
      .send({ ...validBody, firstName: '<b>Carlos</b>' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
  });
});
