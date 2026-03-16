import { Router } from 'express';
import {
  listCandidates,
  getCandidateById,
  createCandidate,
} from '../controllers/candidateController';
import { uploadDocument } from '../controllers/documentController';
import { validateBody, validateQuery } from '../middleware/validation';
import { validateUuidParam } from '../middleware/validateUuid';
import { writeLimiter } from '../middleware/rateLimit';
import { uploadMiddleware } from '../middleware/upload';
import { CreateCandidateSchema } from '../types/candidate';
import { PaginationSchema } from '../types/pagination';
import { UploadDocumentSchema } from '../types/document';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * @openapi
 * /candidates:
 *   get:
 *     summary: List candidates
 *     description: Returns a paginated list of candidates with optional status filter.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of results per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, IN_PROCESS, HIRED, REJECTED, WITHDRAWN]
 *         description: Filter by candidate status
 *     responses:
 *       200:
 *         description: Paginated list of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CandidateSummary'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get('/', validateQuery(PaginationSchema), listCandidates);

/**
 * @openapi
 * /candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     description: Returns full candidate details including education, work experience and documents.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate UUID
 *     responses:
 *       200:
 *         description: Candidate detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandidateDetail'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', validateUuidParam('id'), getCandidateById);

/**
 * @openapi
 * /candidates:
 *   post:
 *     summary: Create a candidate
 *     description: Creates a new candidate with optional education and work experience records.
 *     tags:
 *       - Candidates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateInput'
 *     responses:
 *       201:
 *         description: Candidate created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandidateDetail'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post(
  '/',
  writeLimiter,
  validateBody(CreateCandidateSchema),
  createCandidate,
);

/**
 * @openapi
 * /candidates/{id}/documents:
 *   post:
 *     summary: Upload a document for a candidate
 *     description: >
 *       Uploads a PDF or DOCX document (max 5 MB) and associates it with the candidate.
 *       A candidate may have at most 10 documents.
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Candidate UUID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF or DOCX file (max 5 MB)
 *               type:
 *                 type: string
 *                 enum: [CV, COVER_LETTER, OTHER]
 *                 description: Document type
 *     responses:
 *       201:
 *         description: Document uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/UnprocessableEntity'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */
router.post(
  '/:id/documents',
  writeLimiter,
  validateUuidParam('id'),
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  validateBody(UploadDocumentSchema),
  uploadDocument,
);

export default router;
