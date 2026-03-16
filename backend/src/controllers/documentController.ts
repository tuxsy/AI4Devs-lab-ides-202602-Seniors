import type { Request, Response, NextFunction } from 'express';
import { documentService } from '../services/documentService';
import type { UploadDocumentInput } from '../types/document';
import { ApiError } from '../types/errors';

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const input = req.body as UploadDocumentInput;
    const document = await documentService.upload(
      req.params.id,
      req.file,
      input,
    );
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
}
