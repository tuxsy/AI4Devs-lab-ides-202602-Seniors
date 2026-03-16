import { render, screen, waitFor } from '@testing-library/react';
import CandidateDetail from '../pages/CandidateDetail';
import { api, ApiError } from '../services/api';
import type { CandidateDetail as CandidateDetailType } from '../types/api';

// Mock the API module
jest.mock('../services/api', () => {
  const MockApiError = class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ApiError';
    }
  };

  return {
    api: {
      getCandidateById: jest.fn(),
      uploadDocument: jest.fn(),
    },
    ApiError: MockApiError,
    ERROR_MESSAGES: {
      404: 'The requested resource was not found.',
      500: 'An unexpected error occurred. Please try again later.',
    },
  };
});

const mockCandidate: CandidateDetailType = {
  id: 'candidate-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-1234',
  address: '123 Main St',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  education: [
    {
      id: 'edu-1',
      institution: 'MIT',
      degree: 'Bachelor',
      fieldOfStudy: 'Computer Science',
      startDate: '2018-09-01T00:00:00Z',
      endDate: '2022-05-01T00:00:00Z',
    },
  ],
  workExperiences: [
    {
      id: 'work-1',
      company: 'Tech Corp',
      position: 'Software Engineer',
      startDate: '2022-06-01T00:00:00Z',
      endDate: null,
      description: 'Full-stack development',
    },
  ],
  documents: [
    {
      id: 'doc-1',
      candidateId: 'candidate-123',
      fileUri: '/uploads/resume.pdf',
      fileName: 'resume.pdf',
      mimeType: 'application/pdf',
      size: 102400,
      type: 'CV',
      uploadedAt: '2024-01-15T00:00:00Z',
    },
  ],
};

describe('CandidateDetail', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (api.getCandidateById as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display candidate personal information', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('555-1234')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  it('should display education history', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(
        screen.getByText(/bachelor in computer science/i),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/MIT/i)).toBeInTheDocument();
    });
  });

  it('should display work experience', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Tech Corp/i)).toBeInTheDocument();
    });
  });

  it('should display documents list', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });
  });

  it('should show empty state for no education', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue({
      ...mockCandidate,
      education: [],
    });

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(
        screen.getByText(/no education history recorded/i),
      ).toBeInTheDocument();
    });
  });

  it('should show empty state for no work experience', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue({
      ...mockCandidate,
      workExperiences: [],
    });

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(
        screen.getByText(/no work experience recorded/i),
      ).toBeInTheDocument();
    });
  });

  it('should show empty state for no documents', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue({
      ...mockCandidate,
      documents: [],
    });

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText(/no documents uploaded/i)).toBeInTheDocument();
    });
  });

  it('should show error for candidate not found', async () => {
    (api.getCandidateById as jest.Mock).mockRejectedValue(
      new ApiError(404, 'Not found'),
    );

    render(<CandidateDetail candidateId="nonexistent" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText(/candidate not found/i)).toBeInTheDocument();
    });
  });

  it('should show file upload component', async () => {
    (api.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);

    render(<CandidateDetail candidateId="candidate-123" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText(/upload new document/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    });
  });
});
