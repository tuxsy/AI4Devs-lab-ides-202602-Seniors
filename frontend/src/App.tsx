import { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateDetail from './pages/CandidateDetail';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

type View = 'dashboard' | 'addCandidate' | 'candidateDetail';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );

  const handleNavigateToAddCandidate = (currentUserId: string) => {
    setUserId(currentUserId);
    setView('addCandidate');
  };

  const handleNavigateToCandidateDetail = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setView('candidateDetail');
  };

  const handleNavigateToDashboard = () => {
    setSelectedCandidateId(null);
    setView('dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'addCandidate':
        if (!userId) return null;
        return (
          <AddCandidate
            userId={userId}
            onCancel={handleNavigateToDashboard}
            onSuccess={handleNavigateToDashboard}
          />
        );
      case 'candidateDetail':
        if (!selectedCandidateId) return null;
        return (
          <CandidateDetail
            candidateId={selectedCandidateId}
            onBack={handleNavigateToDashboard}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            onAddCandidate={handleNavigateToAddCandidate}
            onSelectCandidate={handleNavigateToCandidateDetail}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">{renderView()}</div>
    </ThemeProvider>
  );
}

export default App;
