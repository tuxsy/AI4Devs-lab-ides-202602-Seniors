import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { candidateRepository } from '../repositories/candidateRepository';
import type { CreateCandidateInput } from '../types/candidate';
import type { PaginationQuery } from '../types/pagination';
import { ApiError } from '../types/errors';

export const candidateService = {
  async list(query: PaginationQuery) {
    const { candidates, total } = await candidateRepository.findAll(query);
    const { page, limit } = query;
    return {
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const candidate = await candidateRepository.findById(id);
    if (!candidate) {
      throw new ApiError(404, 'Candidate not found');
    }
    return candidate;
  },

  async create(input: CreateCandidateInput) {
    // WARNING: userId is currently passed in request body.
    // TODO: Extract userId from JWT token when authentication is implemented.
    console.warn(
      '[WARNING] userId received in request body. Implement JWT authentication to extract userId from token.',
    );

    try {
      const candidate = await candidateRepository.create(input);
      return candidate;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ApiError(409, 'A candidate with this email already exists');
      }
      throw error;
    }
  },
};
