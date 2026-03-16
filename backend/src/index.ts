import { Request, Response, NextFunction } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import candidatesRouter from './routes/candidates';
import { ApiError } from './types/errors';

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

// Swagger / OpenAPI
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LTI ATS API',
      version: '1.0.0',
      description: 'Applicant Tracking System REST API',
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      schemas: {
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        CandidateSummary: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'IN_PROCESS', 'HIRED', 'REJECTED', 'WITHDRAWN'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CandidateDetail: {
          allOf: [
            { $ref: '#/components/schemas/CandidateSummary' },
            {
              type: 'object',
              properties: {
                address: { type: 'string', nullable: true },
                education: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Education' },
                },
                workExperiences: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/WorkExperience' },
                },
                documents: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Document' },
                },
              },
            },
          ],
        },
        Education: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            institution: { type: 'string' },
            degree: { type: 'string' },
            fieldOfStudy: { type: 'string', nullable: true },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        WorkExperience: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            company: { type: 'string' },
            position: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            description: { type: 'string', nullable: true },
          },
        },
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            candidateId: { type: 'string', format: 'uuid' },
            fileUri: { type: 'string' },
            fileName: { type: 'string' },
            mimeType: { type: 'string' },
            size: { type: 'integer' },
            type: {
              type: 'string',
              enum: ['CV', 'COVER_LETTER', 'OTHER'],
            },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCandidateInput: {
          type: 'object',
          required: ['userId', 'firstName', 'lastName', 'email'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
            firstName: { type: 'string', maxLength: 100 },
            lastName: { type: 'string', maxLength: 100 },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', maxLength: 50 },
            address: { type: 'string', maxLength: 500 },
            education: {
              type: 'array',
              items: {
                type: 'object',
                required: ['institution', 'degree', 'startDate'],
                properties: {
                  institution: { type: 'string' },
                  degree: { type: 'string' },
                  fieldOfStudy: { type: 'string' },
                  startDate: { type: 'string', format: 'date-time' },
                  endDate: { type: 'string', format: 'date-time' },
                },
              },
            },
            workExperiences: {
              type: 'array',
              items: {
                type: 'object',
                required: ['company', 'position', 'startDate'],
                properties: {
                  company: { type: 'string' },
                  position: { type: 'string' },
                  startDate: { type: 'string', format: 'date-time' },
                  endDate: { type: 'string', format: 'date-time' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Invalid input',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        Conflict: {
          description: 'Resource already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        UnprocessableEntity: {
          description: 'Business rule violation',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        TooManyRequests: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req: Request, res: Response) => {
  res.send('Hola LTI!');
});

// Health check route
app.use('/health', healthRouter);

// Candidates routes
app.use('/candidates', candidatesRouter);

// Centralized error handler — must be last middleware (4-arg signature)
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');
    return res.status(400).json({ error: 'ValidationError', message });
  }

  // Multer errors
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ error: 'FileTooLarge', message: 'File exceeds 5 MB limit' });
    }
    return res.status(400).json({ error: 'UploadError', message: err.message });
  }

  // Prisma unique constraint
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this value already exists',
    });
  }

  // App-level ApiError
  if (err instanceof ApiError) {
    const errorName =
      err.statusCode === 404
        ? 'NotFound'
        : err.statusCode === 409
          ? 'Conflict'
          : err.statusCode >= 500
            ? 'InternalServerError'
            : 'BadRequest';
    return res
      .status(err.statusCode)
      .json({ error: errorName, message: err.message });
  }

  // Generic errors
  console.error(err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
