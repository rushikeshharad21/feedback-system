import React from 'react';
import { Paper, Typography, List, Box, Rating, useTheme } from '@mui/material';
import { useDashboardStore } from '../../../../store/dashboardStore';

export default function UserHistoryView() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const feedbacks = useDashboardStore((state) => state.feedbacks) || [];
  const currentUser = useDashboardStore((state) => state.currentUser);

  // 🔐 DATA SECURITY ISOLATION LAYER: Strict local analytical filter
  const myLogs = feedbacks.filter(
    (f) => f?.email?.toLowerCase().trim() === currentUser?.email?.toLowerCase().trim()
  );

  return (
    <Paper sx={styles.panel(isDarkMode)}>
      <Typography variant="h6" sx={styles.panelTitle}>
        Your Previous Responses
      </Typography>

      {myLogs.length === 0 ? (
        <Typography sx={styles.emptyState}>
          No historical telemetry entries found for your account profile data points.
        </Typography>
      ) : (
        <List disablePadding>
          {myLogs.map((log) => (
            <Paper key={log._id || log.id} sx={styles.logCard(isDarkMode)}>
              
              <Box sx={styles.logHeader}>
                <Typography sx={styles.categoryLabel}>
                  {log.category}
                </Typography>
                <Typography variant="caption" sx={styles.timestamp}>
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}
                </Typography>
              </Box>

              <Rating value={log.rating || 0} readOnly size="small" sx={styles.rating} />
              
              <Typography sx={styles.messageText}>
                {log.message}
              </Typography>

            </Paper>
          ))}
        </List>
      )}
    </Paper>
  );
}

/* ==================== PREMIUM ARCHITECTURAL DESIGN SYSTEM STYLES ==================== */
const styles = {
  panel: (isDarkMode) => ({
    p: 4,
    borderRadius: 2,
    boxShadow: 'none',
    border: '1px solid',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    bgcolor: 'background.paper',
    backgroundImage: 'none',
  }),
  panelTitle: {
    fontWeight: 800,
    fontSize: '20px',
    mb: 2,
    color: 'text.primary',
  },
  emptyState: {
    color: 'text.secondary',
    fontStyle: 'italic',
    textAlign: 'center',
    py: 4,
  },
  logCard: (isDarkMode) => ({
    p: 2.5,
    mb: 2,
    bgcolor: isDarkMode ? 'background.default' : '#fbfdfd',
    border: '1px solid',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    boxShadow: 'none',
    backgroundImage: 'none',
    '&:last-child': { mb: 0 }, // Removes excessive spacing on the last item inside the list
  }),
  logHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1,
    alignItems: 'center',
  },
  categoryLabel: {
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#7c3aed',
    fontSize: '12px',
    letterSpacing: '0.5px',
  },
  timestamp: {
    color: 'text.secondary',
  },
  rating: {
    mb: 1,
  },
  messageText: {
    fontSize: '13.5px',
    color: 'text.primary',
    fontWeight: 500,
    lineHeight: 1.5,
  },
};