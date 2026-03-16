import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Max file size: 5 MB
const MAX_SIZE = 5 * 1024 * 1024;

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Validate file type and size
function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only PDF and DOCX files are allowed';
  }
  if (file.size > MAX_SIZE) {
    return 'File size must not exceed 5 MB';
  }
  return null;
}

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

function FileUpload({ onUpload, disabled = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(false);

      if (disabled || uploading) return;

      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, uploading, handleFileSelect],
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        data-testid="file-input"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {!selectedFile ? (
        <Paper
          variant="outlined"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: disabled || uploading ? 'not-allowed' : 'pointer',
            backgroundColor: dragOver ? 'action.hover' : 'background.paper',
            borderStyle: 'dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
          onClick={disabled || uploading ? undefined : handleBrowseClick}
        >
          <CloudUploadIcon
            sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
          />
          <Typography variant="body1" gutterBottom>
            Drag and drop a file here, or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: PDF, DOCX (max 5 MB)
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
            {uploading ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <IconButton
                  onClick={handleRemove}
                  disabled={disabled}
                  size="small"
                  aria-label="Remove file"
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={disabled}
                  size="small"
                >
                  Upload
                </Button>
              </>
            )}
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default FileUpload;
