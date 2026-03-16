import type {
  User,
  CandidatesResponse,
  CandidateDetail,
  CreateCandidateInput,
  Document,
  DocumentType,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

// Error class that includes HTTP status code
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// User-friendly error messages by status code
export const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please review the form — some fields are invalid.',
  409: 'A candidate with this email already exists.',
  404: 'The requested resource was not found.',
  422: 'The request could not be processed.',
  429: 'Too many requests. Please try again later.',
  500: 'An unexpected error occurred. Please try again later.',
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const message =
        ERROR_MESSAGES[response.status] || `HTTP error ${response.status}`;
      let finalMessage = message;
      try {
        const error = await response.json();
        if (error.message) {
          finalMessage = error.message;
        }
      } catch {
        // Use default message if response is not JSON
      }
      throw new ApiError(response.status, finalMessage);
    }

    return response.json();
  }

  async getAutologin(): Promise<User> {
    return this.request<User>('/autologin');
  }

  async getCandidates(params: {
    userId: string;
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<CandidatesResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set('userId', params.userId);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);

    const endpoint = `/candidates?${searchParams.toString()}`;

    return this.request<CandidatesResponse>(endpoint);
  }

  async getCandidateById(id: string): Promise<CandidateDetail> {
    return this.request<CandidateDetail>(`/candidates/${id}`);
  }

  async createCandidate(data: CreateCandidateInput): Promise<CandidateDetail> {
    return this.request<CandidateDetail>('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadDocument(
    candidateId: string,
    file: File,
    type: DocumentType = 'CV',
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(
      `${this.baseUrl}/candidates/${candidateId}/documents`,
      {
        method: 'POST',
        body: formData,
        // Note: Do NOT set Content-Type header for multipart/form-data
        // The browser will set it automatically with the boundary
      },
    );

    if (!response.ok) {
      const msg =
        ERROR_MESSAGES[response.status] || `HTTP error ${response.status}`;
      let finalMsg = msg;
      try {
        const error = await response.json();
        if (error.message) {
          finalMsg = error.message;
        }
      } catch {
        // Use default message if response is not JSON
      }
      throw new ApiError(response.status, finalMsg);
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);
