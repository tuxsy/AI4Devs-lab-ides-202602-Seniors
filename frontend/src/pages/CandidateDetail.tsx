import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FileUpload from '../components/FileUpload';
import { api, ERROR_MESSAGES } from '../services/api';
import type {
  CandidateDetail as CandidateDetailType,
  CandidateStatus,
} from '../types/api';
import './CandidateDetail.css';

const statusColors: Record<
  CandidateStatus,
  'default' | 'primary' | 'success' | 'error' | 'warning'
> = {
  ACTIVE: 'primary',
  IN_PROCESS: 'warning',
  HIRED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'default',
};

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface CandidateDetailProps {
  candidateId: string;
  onBack: () => void;
}

function CandidateDetail({ candidateId, onBack }: CandidateDetailProps) {
  const [candidate, setCandidate] = useState<CandidateDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch candidate data
  const fetchCandidate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getCandidateById(candidateId);
      setCandidate(data);
    } catch (err) {
      // Use duck typing to check for ApiError (compatible with Jest mocks)
      const apiError = err as { statusCode?: number; message?: string };
      if (apiError.statusCode !== undefined) {
        if (apiError.statusCode === 404) {
          setError('Candidate not found');
        } else {
          setError(
            ERROR_MESSAGES[apiError.statusCode] ||
              apiError.message ||
              'An error occurred',
          );
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  // Handle document upload
  const handleUpload = async (file: File) => {
    await api.uploadDocument(candidateId, file, 'CV');
    setUploadSuccess(true);
    // Refresh candidate data to show new document
    await fetchCandidate();
    // Hide success message after delay
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  if (loading) {
    return (
      <Box className="candidate-detail-loading">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading candidate details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="candidate-detail-container">
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onBack}>
              Back to Dashboard
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <Box className="candidate-detail-container">
      {/* Header */}
      <Box className="candidate-detail-header">
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          Back to Dashboard
        </Button>
      </Box>

      {/* Personal Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h1">
            {candidate.firstName} {candidate.lastName}
          </Typography>
          <Chip
            label={candidate.status}
            color={statusColors[candidate.status]}
          />
        </Box>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={candidate.email} />
          </ListItem>
          {candidate.phone && (
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText primary={candidate.phone} />
            </ListItem>
          )}
          {candidate.address && (
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary={candidate.address} />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Education Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Education
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {candidate.education.length === 0 ? (
          <Typography color="text.secondary">
            No education history recorded
          </Typography>
        ) : (
          <List>
            {candidate.education.map((edu) => (
              <ListItem key={edu.id} alignItems="flex-start">
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`}
                  secondary={
                    <>
                      {edu.institution}
                      <br />
                      {formatDate(edu.startDate)} -{' '}
                      {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Work Experience Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Work Experience
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {candidate.workExperiences.length === 0 ? (
          <Typography color="text.secondary">
            No work experience recorded
          </Typography>
        ) : (
          <List>
            {candidate.workExperiences.map((exp) => (
              <ListItem key={exp.id} alignItems="flex-start">
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary={exp.position}
                  secondary={
                    <>
                      {exp.company}
                      <br />
                      {formatDate(exp.startDate)} -{' '}
                      {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      {exp.description && (
                        <>
                          <br />
                          {exp.description}
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Documents Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Documents
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {candidate.documents.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No documents uploaded
          </Typography>
        ) : (
          <List sx={{ mb: 2 }}>
            {candidate.documents.map((doc) => (
              <ListItem key={doc.id}>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={doc.fileName}
                  secondary={
                    <>
                      {doc.type} - {formatFileSize(doc.size)}
                      <br />
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {uploadSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Document uploaded successfully!
          </Alert>
        )}

        <Typography variant="subtitle2" gutterBottom>
          Upload New Document
        </Typography>
        <FileUpload onUpload={handleUpload} />
      </Paper>
    </Box>
  );
}

export default CandidateDetail;
