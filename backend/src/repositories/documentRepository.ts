import prisma from '../index';
import type { DocumentType } from '@prisma/client';

export interface CreateDocumentData {
  candidateId: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  size: number;
  type: DocumentType;
}

export const documentRepository = {
  async create(data: CreateDocumentData) {
    return prisma.document.create({ data });
  },
};
