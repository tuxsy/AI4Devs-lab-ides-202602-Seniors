import { z } from 'zod';

// Mirror of Prisma's DocumentType enum — avoids nativeEnum runtime dependency
export const DocumentTypeSchema = z.enum(['CV', 'COVER_LETTER', 'OTHER']);

export const UploadDocumentSchema = z.object({
  type: DocumentTypeSchema,
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
