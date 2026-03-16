import { candidateRepository } from '../repositories/candidateRepository';
import { documentRepository } from '../repositories/documentRepository';
import type { UploadDocumentInput } from '../types/document';
import { ApiError } from '../types/errors';
import type { DocumentType } from '@prisma/client';

const MAX_DOCUMENTS_PER_CANDIDATE = 10;

export const documentService = {
  async upload(
    candidateId: string,
    file: Express.Multer.File,
    input: UploadDocumentInput,
  ) {
    // Check candidate exists
    const candidate = await candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new ApiError(404, 'Candidate not found');
    }

    // Enforce document limit
    const count = await candidateRepository.countDocuments(candidateId);
    if (count >= MAX_DOCUMENTS_PER_CANDIDATE) {
      throw new ApiError(
        422,
        `Candidate already has the maximum of ${MAX_DOCUMENTS_PER_CANDIDATE} documents`,
      );
    }

    const fileUri = `fs://uploads/${file.filename}`;

    const document = await documentRepository.create({
      candidateId,
      fileUri,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      type: input.type as DocumentType,
    });

    return document;
  },
};
