import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCandidate from '../pages/AddCandidate';
import { api } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
  api: {
    createCandidate: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  ERROR_MESSAGES: {
    400: 'Please review the form — some fields are invalid.',
    409: 'A candidate with this email already exists.',
  },
}));

describe('AddCandidate', () => {
  const mockUserId = 'test-user-id';
  const mockOnCancel = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form', () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText('Add New Candidate')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    // Submit via the submit button
    const submitButton = screen.getByRole('button', {
      name: /add candidate/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button clicked', () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    (api.createCandidate as jest.Mock).mockResolvedValue({
      id: 'new-candidate-id',
    });

    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    const submitButton = screen.getByRole('button', { name: /add candidate/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.createCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        }),
      );
    });

    await waitFor(
      () => {
        expect(
          screen.getByText(/candidate added successfully/i),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('should add and remove education entries', async () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    // Click add education button
    const addEducationButton = screen.getByRole('button', {
      name: /add education/i,
    });
    fireEvent.click(addEducationButton);

    // Should show education entry
    await waitFor(() => {
      expect(screen.getByText(/education #1/i)).toBeInTheDocument();
    });

    // Remove the education entry
    const removeButton = screen.getByLabelText(/remove education/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(/education #1/i)).not.toBeInTheDocument();
    });
  });

  it('should add and remove work experience entries', async () => {
    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    // Click add work experience button
    const addWorkExpButton = screen.getByRole('button', {
      name: /add work experience/i,
    });
    fireEvent.click(addWorkExpButton);

    // Should show work experience entry
    await waitFor(() => {
      expect(screen.getByText(/work experience #1/i)).toBeInTheDocument();
    });

    // Remove the work experience entry
    const removeButton = screen.getByLabelText(/remove work experience/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText(/work experience #1/i)).not.toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    const { ApiError } = jest.requireMock('../services/api');
    (api.createCandidate as jest.Mock).mockRejectedValue(
      new ApiError(409, 'A candidate with this email already exists.'),
    );

    render(
      <AddCandidate
        userId={mockUserId}
        onCancel={mockOnCancel}
        onSuccess={mockOnSuccess}
      />,
    );

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' },
    });

    const submitButton = screen.getByRole('button', { name: /add candidate/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    });
  });
});
