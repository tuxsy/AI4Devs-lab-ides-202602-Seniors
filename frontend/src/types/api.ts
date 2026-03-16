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

// Education types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
}

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}

// Work Experience types
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface WorkExperienceInput {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

// Document types
export type DocumentType = 'CV' | 'COVER_LETTER' | 'OTHER';

export interface Document {
  id: string;
  candidateId: string;
  fileUri: string;
  fileName: string;
  mimeType: string;
  size: number;
  type: DocumentType;
  uploadedAt: string;
}

// Candidate Detail (full candidate with relations)
export interface CandidateDetail extends CandidateSummary {
  address: string | null;
  education: Education[];
  workExperiences: WorkExperience[];
  documents: Document[];
}

// Create Candidate Input
export interface CreateCandidateInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: EducationInput[];
  workExperiences?: WorkExperienceInput[];
}
