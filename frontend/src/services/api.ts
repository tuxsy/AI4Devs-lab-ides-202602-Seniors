import type { User, CandidatesResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

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
      const error = await response.json();
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  async getAutologin(): Promise<User> {
    return this.request<User>('/autologin');
  }

  async getCandidates(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<CandidatesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    const endpoint = query ? `/candidates?${query}` : '/candidates';

    return this.request<CandidatesResponse>(endpoint);
  }
}

export const api = new ApiClient(API_BASE_URL);
