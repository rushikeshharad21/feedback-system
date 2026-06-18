import React, { useState } from 'react';
import {
  Box, Typography, Divider, Stack, Button, Card, 
  CardContent, Switch, FormControlLabel, Alert, 
  Snackbar, Grid, useTheme, Avatar
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import InputIcon from '@mui/icons-material/Input';
import ContrastIcon from '@mui/icons-material/Contrast';
import StorageIcon from '@mui/icons-material/Storage';
import { useDashboardStore } from '../../../store/dashboardStore.js';

export default function SettingsPage() {
  const theme = useTheme();
  
  // Zustand Store Actions & State
  const themeMode = useDashboardStore((state) => state.themeMode);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);
  const clearNotifications = useDashboardStore((state) => state.clearNotifications);
  const addNotification = useDashboardStore((state) => state.addNotification);
  const injectRealFeedback = useDashboardStore((state) => state.injectRealFeedback);
  const feedbacks = useDashboardStore((state) => state.feedbacks || []);
  const notifications = useDashboardStore((state) => state.notifications || []);

  // Local Toast State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // 🧪 टेस्ट पॅकेट जनरेट करून लाईव्ह स्ट्रीम तपासण्यासाठी
  const handleInjectMockNotification = () => {
    const mockPayload = {
      id: `mock-trigger-${Date.now()}`,
      name: 'Rushi Harad (QA Engine)',
      email: 'rushi@dev.io',
      category: Math.random() > 0.5 ? 'bug' : 'feature',
      message: `Automated terminal probe submission successful. Salt cluster state: stable. Timestamp: ${new Date().toLocaleTimeString()}`,
      createdAt: new Date().toISOString()
    };
    
    if (addNotification) {
      addNotification(mockPayload);
      showToast('Live test notification injected into the store stream!');
    }
  };

  // 📊 चार्ट्स आणि डेटा ग्रिड तपासण्यासाठी डेटा इंजेक्ट करणे
  const handleInjectMockFeedback = () => {
    const mockFeedback = {
      _id: String(Date.now()),
      name: 'System Watchdog',
      email: 'watchdog@system.io',
      category: 'praise',
      rating: 5,
      message: 'Standalone injection test verified by client admin console.',
      createdAt: new Date().toISOString()
    };

    if (injectRealFeedback) {
      injectRealFeedback(mockFeedback);
      showToast('Mock Analytics data item successfully injected!');
    }
  };

  const handleClearAllNotifications = () => {
    if (clearNotifications) {
      clearNotifications();
      showToast('All live notification records purged successfully.', 'warning');
    }
  };

  return (
    <Box sx={styles.container}>
      
      {/* ── HEADER SECTION ── */}
      <Box sx={styles.header}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          <TuneIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={styles.title}>
            System Controller & Orchestrator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage global data payloads, trigger reactive streams, and override environment parameters.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        
        {/* ── CARD 1: GLOBAL UI CONTROLS ── */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} variant="outlined" sx={styles.card}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <ContrastIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>Theme & Interface Preference</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Toggles the theme matrix across all administrative layouts. Currently bound to local client caching mechanisms.
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={themeMode === 'dark'} 
                    onChange={toggleTheme} 
                    color="primary"
                  />
                }
                label={
                  <Typography fontWeight={600}>
                    Active Mode: {themeMode.toUpperCase()}
                  </Typography>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ── CARD 2: REAL-TIME INJECTION ENGINE ── */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} variant="outlined" sx={styles.card}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <InputIcon color="success" />
                <Typography variant="h6" fontWeight={700}>Stream Testing Engine</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Simulate high-throughput incoming transmissions to verify <code style={{color: '#7c3aed'}}>SettingsView</code> reactive loops and charts.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  disableElevation
                  onClick={handleInjectMockNotification}
                  sx={styles.btn}
                >
                  Trigger Live Notification
                </Button>
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={handleInjectMockFeedback}
                  sx={styles.btn}
                >
                  Inject Chart Feedback
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── CARD 3: BUFFER & MEMORY PURGE ── */}
        <Grid item xs={12}>
          <Card elevation={0} variant="outlined" sx={{ ...styles.card, borderColor: 'error.light' }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <DeleteSweepIcon color="error" />
                <Typography variant="h6" fontWeight={700} color="error.main">System Cache Purge & Metrics</Typography>
              </Stack>
              
              {/* Live metrics indicator boxes */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={styles.metricBox}>
                    <Typography variant="caption" color="text.secondary">FEEDBACK BUFFER</Typography>
                    <Typography variant="h6" fontWeight={700}>{feedbacks.length} Items</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={styles.metricBox}>
                    <Typography variant="caption" color="text.secondary">NOTIF STACK SIZE</Typography>
                    <Typography variant="h6" fontWeight={700}>{notifications.length} Nodes</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Clears the temporary notifications array stack located inside the Zustand storage layer. This action propagates immediately across all pages.
              </Typography>

              <Button 
                variant="contained" 
                color="error" 
                disableElevation
                startIcon={<DeleteSweepIcon />}
                onClick={handleClearAllNotifications}
                disabled={notifications.length === 0}
              >
                Flush Notification Stack
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ── NOTIFICATION COMPONENT ── */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}

/* ── ENGINEER-GRADE ARCHITECTURAL STYLES ── */
const styles = {
  container: {
    maxWidth: 1000,
    mx: 'auto',
    py: { xs: 2, sm: 4 },
    px: { xs: 1.5, sm: 3 },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 2.5,
  },
  title: {
    letterSpacing: -0.5,
    fontSize: { xs: '1.75rem', sm: '2.25rem' },
  },
  card: {
    borderRadius: 4,
    bgcolor: 'background.paper',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    p: 1
  },
  btn: {
    borderRadius: 2.5,
    textTransform: 'none',
    fontWeight: 700,
    px: 3,
    py: 1
  },
  metricBox: {
    bgcolor: 'action.hover',
    p: 1.5,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider'
  }
};