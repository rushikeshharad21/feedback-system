import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from "./components/Loginpage"
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Custom clean theme configuration
const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' }, // Modern blue
    secondary: { main: '#8b5cf6' }, // Vibrant purple
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Standardizes CSS normalization */}
      {currentPage === 'landing' ? (
        <LandingPage onNavigateToLogin={() => setCurrentPage('login')} />
      ) : (
        <LoginPage onNavigateBack={() => setCurrentPage('landing')} />
      )}
    </ThemeProvider>
  );
}

export default App;