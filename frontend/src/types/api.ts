// Types based on openapi.json schema

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export type CandidateStatus =
  | 'ACTIVE'
  | 'IN_PROCESS'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface CandidateSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CandidatesResponse {
  data: CandidateSummary[];
  pagination: Pagination;
}

export interface ApiError {
  error: string;
  message: string;
}
