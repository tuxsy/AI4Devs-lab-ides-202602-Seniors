import { z } from 'zod';

// Mirror of Prisma's CandidateStatus enum
export const CandidateStatusSchema = z.enum([
  'ACTIVE',
  'IN_PROCESS',
  'HIRED',
  'REJECTED',
  'WITHDRAWN',
]);

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: CandidateStatusSchema.optional(),
});

export type PaginationQuery = z.infer<typeof PaginationSchema>;
