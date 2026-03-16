import request from 'supertest';
import path from 'path';
import fs from 'fs';
import os from 'os';

const candidateId = '00000000-0000-0000-0000-000000000010';

const mockDocumentCreate = jest.fn();
const mockDocumentCount = jest.fn();
const mockCandidateFindUnique = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      findUnique: mockCandidateFindUnique,
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
    document: {
      create: mockDocumentCreate,
      count: mockDocumentCount,
    },
    $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    $transaction: jest.fn(),
  })),
  CandidateStatus: {
    ACTIVE: 'ACTIVE',
    IN_PROCESS: 'IN_PROCESS',
    HIRED: 'HIRED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN',
  },
}));

// Override upload destination to OS temp dir for tests
process.env.UPLOAD_DIR = os.tmpdir();

import { app } from '../index';

const candidateDetail = {
  id: candidateId,
  firstName: 'Ana',
  lastName: 'Garcia',
  email: 'ana@example.com',
  phone: null,
  status: 'ACTIVE',
  address: null,
  education: [],
  workExperiences: [],
  documents: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const documentRecord = {
  id: '00000000-0000-0000-0000-000000000020',
  candidateId,
  fileUri: `fs://uploads/some-uuid.pdf`,
  fileName: 'test.pdf',
  mimeType: 'application/pdf',
  size: 1024,
  type: 'CV',
  uploadedAt: new Date().toISOString(),
};

// Create a real tiny PDF-like file in temp dir for upload tests
let testPdfPath: string;
let testDocxPath: string;
let testTxtPath: string;

beforeAll(() => {
  testPdfPath = path.join(os.tmpdir(), 'test.pdf');
  testDocxPath = path.join(os.tmpdir(), 'test.docx');
  testTxtPath = path.join(os.tmpdir(), 'test.txt');

  fs.writeFileSync(testPdfPath, '%PDF-1.4 fake pdf content');
  // DOCX magic bytes: PK (zip)
  const docxBuf = Buffer.concat([
    Buffer.from([0x50, 0x4b, 0x03, 0x04]),
    Buffer.from(' fake docx'),
  ]);
  fs.writeFileSync(testDocxPath, docxBuf);
  fs.writeFileSync(testTxtPath, 'plain text content');
});

afterAll(() => {
  [testPdfPath, testDocxPath, testTxtPath].forEach((f) => {
    try {
      fs.unlinkSync(f);
    } catch {
      /* ignore */
    }
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockCandidateFindUnique.mockResolvedValue(candidateDetail);
  mockDocumentCount.mockResolvedValue(0);
  mockDocumentCreate.mockResolvedValue(documentRecord);
});

// ---------------------------------------------------------------------------
// POST /candidates/:id/documents
// ---------------------------------------------------------------------------
describe('POST /candidates/:id/documents', () => {
  it('returns 201 when PDF is uploaded successfully', async () => {
    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .attach('file', testPdfPath)
      .field('type', 'CV');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('returns 400 when no file is provided', async () => {
    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .field('type', 'CV');

    expect(res.status).toBe(400);
  });

  it('returns 400 for unsupported file type (txt)', async () => {
    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .attach('file', testTxtPath)
      .field('type', 'CV');

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid UUID in path', async () => {
    const res = await request(app)
      .post('/candidates/not-a-uuid/documents')
      .attach('file', testPdfPath)
      .field('type', 'CV');

    expect(res.status).toBe(400);
  });

  it('returns 404 when candidate does not exist', async () => {
    mockCandidateFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .attach('file', testPdfPath)
      .field('type', 'CV');

    expect(res.status).toBe(404);
  });

  it('returns 422 when candidate already has 10 documents', async () => {
    mockDocumentCount.mockResolvedValue(10);

    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .attach('file', testPdfPath)
      .field('type', 'CV');

    expect(res.status).toBe(422);
  });

  it('returns 400 when document type is missing', async () => {
    const res = await request(app)
      .post(`/candidates/${candidateId}/documents`)
      .attach('file', testPdfPath);

    expect(res.status).toBe(400);
  });
});
