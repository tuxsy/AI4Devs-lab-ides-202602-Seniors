import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../components/FileUpload';

// Mock file creation helper
function createMockFile(name: string, size: number, type: string): File {
  const file = new File(['x'.repeat(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('FileUpload', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('should render upload area', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, DOCX/i)).toBeInTheDocument();
  });

  it('should accept valid PDF file', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('should accept valid DOCX file', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile(
      'test.docx',
      1024,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.docx')).toBeInTheDocument();
    });
  });

  it('should reject invalid file type', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.jpg', 1024, 'image/jpeg');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Only PDF and DOCX files are allowed/i),
      ).toBeInTheDocument();
    });
  });

  it('should reject file exceeding 5 MB', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const sixMB = 6 * 1024 * 1024;
    const file = createMockFile('large.pdf', sixMB, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText(/File size must not exceed 5 MB/i),
      ).toBeInTheDocument();
    });
  });

  it('should allow removing selected file', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const removeButton = screen.getByLabelText(/remove file/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
    });
  });

  it('should call onUpload when upload button clicked', async () => {
    mockOnUpload.mockResolvedValue(undefined);
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });
  });

  it('should show loading state during upload', async () => {
    // Make upload take some time
    mockOnUpload.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.pdf', 1024, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    // Should show loading indicator
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('should display file size', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);

    const file = createMockFile('test.pdf', 2048, 'application/pdf');
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    });
  });
});
