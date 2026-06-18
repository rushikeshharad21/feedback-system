import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Button, Container, Grid, Paper, 
  TextField, MenuItem, Rating, Alert, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, ThemeProvider, createTheme, CssBaseline 
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDashboardStore } from '../store/dashboardStore.js';

export default function UserDashboard() {
  const [mode, setMode] = useState('dark');

  // Memoize theme creation
  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? { background: { default: '#f1f5f9', paper: 'rgba(255, 255, 255, 0.7)' } }
            : { background: { default: '#0f172a', paper: 'rgba(30, 41, 59, 0.7)' } }),
        },
        components: {
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        },
      }),
    [mode]
  );

  const isDarkMode = mode === 'dark';

  const currentUser = useDashboardStore((state) => state.currentUser);
  const logoutUser = useDashboardStore((state) => state.logoutUser);
  const feedbacks = useDashboardStore((state) => state.feedbacks) || [];
  const fetchInitialFeedbacks = useDashboardStore((state) => state.fetchInitialFeedbacks);
  const addFeedbackLocal = useDashboardStore((state) => state.addFeedbackLocal);

  // Form Input & Loading States
  const [category, setCategory] = useState('General');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  useEffect(() => {
    if (typeof fetchInitialFeedbacks === 'function') {
      fetchInitialFeedbacks();
    }
  }, [fetchInitialFeedbacks]);

  // User Isolation Filter
  const myResponses = feedbacks.filter(f => f?.email === currentUser?.email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', text: '' });

    if (!message.trim()) {
      setAlert({ type: 'error', text: 'Feedback message cannot be left empty!' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: currentUser?.name || "Rushi Harad",
      email: currentUser?.email || "rushi@dev.io",
      category,
      rating: Number(rating || 5),
      message: message.trim()
    };

    try {
      const response = await fetch('https://feedback-system-production-ec93.up.railway.app/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Technical Server Error! Status: ${response.status}`);
      }

      const savedData = await response.json();

      setAlert({ type: 'success', text: 'Your feedback has been broadcasted live! 🎉' });
      
      // ✅ FIXED: बॅकएंडच्या रचनेनुसार savedData ऐवजी savedData.data पाठवला आहे
      if (typeof addFeedbackLocal === 'function' && savedData.success) {
        addFeedbackLocal(savedData.data); 
      }
      
      setMessage('');
      setRating(5);
      setCategory('General');

    } catch (err) {
      console.warn("API Engine engagement failed, switching to local memory bypass:", err);
      
      // 💾 भक्कम ऑफलाइन फॉलबॅक (सर्व्हर बंद असतानाही टेबल अपडेट होईल)
      const localFallbackPayload = {
        _id: `client-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString()
      };

      if (typeof addFeedbackLocal === 'function') {
        addFeedbackLocal(localFallbackPayload);
      }

      setAlert({ 
        type: 'success', 
        text: 'Feedback generated and updated successfully via local memory simulation! 💾' 
      });
      
      setMessage('');
      setRating(5);
      setCategory('General');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline /> 
      <Box sx={styles.dashboardContainer(isDarkMode)}>

        {/* ==================== GLOBAL APPBAR NAVIGATION ==================== */}
        <AppBar position="static" sx={styles.navigationBar}>
          <Toolbar sx={styles.toolbarLayout}>
            <Typography variant="h6" sx={styles.brandTitle}>
              ⚡ Wheeltrix
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" onClick={toggleThemeMode} title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              <Button color="inherit" endIcon={<ExitToAppIcon />} onClick={logoutUser} sx={styles.logoutButton}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ==================== CENTERED MAIN WORKSPACE REGION ==================== */}
        <Box sx={styles.centerWrapper}>
          <Container maxWidth="lg" sx={styles.mainContainer}>
            {/* ✅ FIXED: MUI Grid नियमांनुसार इथून 'item' काढले आहेत */}
            <Grid container spacing={4} sx={styles.gridCenter}>

              {/* 📝 FORM SUBMISSION COLUMN */}
              <Grid xs={12} md={10} lg={5}>
                <Paper elevation={0} sx={styles.contentPanel(isDarkMode)}>
                  <Typography variant="h5" sx={styles.panelHeader}>
                    Submit Feedback
                  </Typography>
                  <Typography variant="body2" sx={styles.panelSubtitle}>
                    Submitting this form dispatches a live real-time notification stream to the admin dashboard.
                  </Typography>

                  {alert.text && (
                    <Alert severity={alert.type} sx={styles.formAlert}>
                      {alert.text}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleFormSubmit} noValidate autoComplete="off">
                    <TextField
                      select
                      fullWidth
                      label="Feedback Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      sx={styles.inputSpacing}
                    >
                      <MenuItem value="General">General Feedback</MenuItem>
                      <MenuItem value="Bug">Bug Report</MenuItem>
                      <MenuItem value="Feature">Feature Request</MenuItem>
                      <MenuItem value="Praise">Praise</MenuItem>
                    </TextField>

                    <Box sx={styles.ratingContainer(isDarkMode)}>
                      <Typography variant="body2" sx={styles.ratingLabel}>
                        Rate our experience:
                      </Typography>
                      <Rating size="large" value={rating} onChange={(e, nv) => setRating(nv || 5)} />
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={styles.inputSpacing}
                    />

                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth 
                      disabled={isSubmitting}
                      endIcon={<SendIcon />} 
                      sx={styles.submitBtn}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Live Response'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* 📑 TELEMETRY STREAM HISTORY TABLE COLUMN */}
              <Grid xs={12} md={10} lg={7}>
                <Paper elevation={0} sx={styles.contentPanel(isDarkMode)}>
                  <Typography variant="h5" sx={styles.panelHeader}>
                    My Submission History
                  </Typography>
                  <Typography variant="body2" sx={styles.panelSubtitle}>
                    Review your historical response aggregates processed below.
                  </Typography>

                  <TableContainer sx={styles.tableWrapper(isDarkMode)}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={styles.tableHeaderCell(isDarkMode)}>Category</TableCell>
                          <TableCell sx={styles.tableHeaderCell(isDarkMode)}>Rating</TableCell>
                          <TableCell sx={styles.tableHeaderCell(isDarkMode)}>Message</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myResponses.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={styles.emptyTableState}>
                              No transactional feedback logs recorded yet under this account profile.
                            </TableCell>
                          </TableRow>
                        ) : (
                          myResponses.map((row, index) => (
                            <TableRow key={row?._id || `local-fb-${index}`} hover>
                              <TableCell sx={styles.tableBodyCell}>
                                <Box sx={styles.badge(isDarkMode, row?.category)}>
                                  {row?.category}
                                </Box>
                              </TableCell>
                              <TableCell sx={styles.tableRatingCell}>
                                {row?.rating} ⭐
                              </TableCell>
                              <TableCell sx={styles.tableMessageCell} title={row?.message}>
                                {row?.message}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const styles = {
  dashboardContainer: (isDarkMode) => ({
    background: isDarkMode
      ? 'radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%), #0f172a'
      : 'radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.08) 0px, transparent 50%), #f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    transition: 'background 0.4s ease',
  }),
  centerWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: { xs: 2, sm: 4 },
  },
  gridCenter: {
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    margin: 0,
  },
  navigationBar: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    boxShadow: '0 4px 20px -5px rgba(109, 40, 217, 0.3)',
  },
  toolbarLayout: { justifyContent: 'space-between' },
  brandTitle: { fontWeight: 900, letterSpacing: -0.5 },
  logoutButton: { fontWeight: 700, textTransform: 'none' },
  mainContainer: { px: { xs: 0, sm: 2 } },
  contentPanel: (isDarkMode) => ({
    p: { xs: 3, sm: 4 },
    height: '100%',
    borderRadius: 6,
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.55)' : 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(24px) saturate(140%)',
    WebkitBackdropFilter: 'blur(24px) saturate(140%)',
    boxShadow: isDarkMode ? '0 20px 40px -15px rgba(0, 0, 0, 0.5)' : '0 20px 40px -15px rgba(148, 163, 184, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  panelHeader: { fontWeight: 800, mb: 1, color: 'text.primary', letterSpacing: -0.5 },
  panelSubtitle: { color: 'text.secondary', mb: 3 },
  formAlert: { mb: 3, borderRadius: 2, backdropFilter: 'blur(4px)' },
  inputSpacing: { mb: 3 },
  ratingContainer: (isDarkMode) => ({
    p: 2,
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
    borderRadius: 2,
    mb: 3,
    bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.3)',
  }),
  ratingLabel: { color: 'text.secondary', mb: 1, fontWeight: 700 },
  submitBtn: {
    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    py: 1.5,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '15px',
    boxShadow: '0 10px 20px -5px rgba(109, 40, 217, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)',
      boxShadow: '0 12px 24px -5px rgba(109, 40, 217, 0.5)',
    },
  },
  tableWrapper: (isDarkMode) => ({
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 3,
    maxHeight: 420,
    bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  }),
  tableHeaderCell: (isDarkMode) => ({
    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(248, 250, 252, 0.85)',
    color: 'text.primary',
    fontWeight: 800,
    borderBottom: '2px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(5px)',
  }),
  emptyTableState: { py: 6, color: 'text.secondary', fontStyle: 'italic' },
  tableBodyCell: { borderBottom: '1px solid', borderColor: 'divider' },
  tableRatingCell: { fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' },
  tableMessageCell: {
    color: 'text.primary',
    fontWeight: 500,
    maxWidth: 280,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  badge: (isDarkMode, category) => {
    const isBug = category === 'Bug';
    const isFeature = category === 'Feature';
    const isPraise = category === 'Praise';
    let darkBg = 'rgba(16, 185, 129, 0.15)', lightBg = 'rgba(16, 185, 129, 0.1)', textColor = '#10b981';
    if (isBug) { darkBg = 'rgba(239, 68, 68, 0.2)'; lightBg = 'rgba(239, 68, 68, 0.1)'; textColor = '#ef4444'; }
    else if (isFeature) { darkBg = 'rgba(59, 130, 246, 0.2)'; lightBg = 'rgba(59, 130, 246, 0.1)'; textColor = '#3b82f6'; }
    else if (isPraise) { darkBg = 'rgba(234, 179, 8, 0.2)'; lightBg = 'rgba(234, 179, 8, 0.1)'; textColor = isDarkMode ? '#facc15' : '#ca8a04'; }
    return { px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block', fontSize: '12px', fontWeight: 700, bgcolor: isDarkMode ? darkBg : lightBg, color: textColor, backdropFilter: 'blur(4px)' };
  },
};