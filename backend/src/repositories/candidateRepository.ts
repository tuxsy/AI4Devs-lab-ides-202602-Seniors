import prisma from '../index';
import type { CreateCandidateInput } from '../types/candidate';
import type { PaginationQuery } from '../types/pagination';
import { CandidateStatus } from '@prisma/client';

export const candidateRepository = {
  async findAll(query: PaginationQuery) {
    const { page, limit, status, userId } = query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return { candidates, total };
  },

  async findById(id: string) {
    return prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        workExperiences: true,
        documents: true,
      },
    });
  },

  async create(data: CreateCandidateInput) {
    const { education, workExperiences, ...candidateData } = data;

    return prisma.$transaction(async (tx) => {
      const candidate = await tx.candidate.create({
        data: {
          ...candidateData,
          status: CandidateStatus.ACTIVE,
        },
      });

      if (education && education.length > 0) {
        await tx.education.createMany({
          data: education.map((edu) => ({
            ...edu,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            candidateId: candidate.id,
          })),
        });
      }

      if (workExperiences && workExperiences.length > 0) {
        await tx.workExperience.createMany({
          data: workExperiences.map((exp) => ({
            ...exp,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            candidateId: candidate.id,
          })),
        });
      }

      return tx.candidate.findUnique({
        where: { id: candidate.id },
        include: {
          education: true,
          workExperiences: true,
        },
      });
    });
  },

  async countDocuments(candidateId: string): Promise<number> {
    return prisma.document.count({ where: { candidateId } });
  },
};
