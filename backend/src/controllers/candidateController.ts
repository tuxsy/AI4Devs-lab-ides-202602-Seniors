import type { Request, Response, NextFunction } from 'express';
import { candidateService } from '../services/candidateService';
import type { PaginationQuery } from '../types/pagination';
import type { CreateCandidateInput } from '../types/candidate';

export async function listCandidates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = req.query as unknown as PaginationQuery;
    const result = await candidateService.list(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCandidateById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const candidate = await candidateService.getById(req.params.id);
    res.status(200).json(candidate);
  } catch (error) {
    next(error);
  }
}

export async function createCandidate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body as CreateCandidateInput;
    const candidate = await candidateService.create(input);
    res.status(201).json(candidate);
  } catch (error) {
    next(error);
  }
}
