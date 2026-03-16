import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../services/api';
import type { User, CandidateSummary, CandidateStatus } from '../types/api';
import './Dashboard.css';

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

interface DashboardProps {
  onAddCandidate: (userId: string) => void;
  onSelectCandidate: (candidateId: string) => void;
}

function Dashboard({ onAddCandidate, onSelectCandidate }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [candidates, setCandidates] = useState<CandidateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user data via autologin
      const userData = await api.getAutologin();
      setUser(userData);

      // Fetch candidates for the logged-in recruiter
      const candidatesResponse = await api.getCandidates({
        userId: userData.id,
      });
      setCandidates(candidatesResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCandidate = () => {
    if (user) {
      onAddCandidate(user.id);
    }
  };

  const handleRowClick = (candidateId: string) => {
    onSelectCandidate(candidateId);
  };

  if (loading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="dashboard-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      {/* User Info Card */}
      {user && (
        <Card className="user-card">
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome, {user.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Candidates Header with Add Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h3">
          Your Candidates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCandidate}
          size="large"
        >
          Add Candidate
        </Button>
      </Box>

      {candidates.length === 0 ? (
        <Alert severity="info">
          No candidates found. Click "Add Candidate" to create your first one.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  onClick={() => handleRowClick(candidate.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    {candidate.firstName} {candidate.lastName}
                  </TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.status}
                      color={statusColors[candidate.status]}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Dashboard;
