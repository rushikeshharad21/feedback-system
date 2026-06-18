import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Divider, Stack, Alert, Badge, Chip,
  Paper, Fade, Card, CardContent
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { useDashboardStore } from '../../../store/dashboardStore.js';

export default function SettingsView() {
  const notifications = useDashboardStore((state) => state.notifications || []);

  const [toastOpen, setToastOpen] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  const lastSeenIdRef = useRef(notifications && notifications.length > 0 ? notifications[0]?.id : null);

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    const newest = notifications[0];
    const newestId = newest?.id ?? null;

    if (newestId !== null && newestId !== lastSeenIdRef.current) {
      lastSeenIdRef.current = newestId;
      setLatestNotification(newest);
      setToastOpen(true);
    }
  }, [notifications]);

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'bug':     return 'error';
      case 'feature': return 'info';
      case 'praise':  return 'success';
      default:        return 'secondary';
    }
  };

  return (
    <Box sx={styles.root}>

      {/* ── HEADER ── */}
      <Box sx={styles.headerRow}>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={800} sx={styles.title}>
            Live Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={styles.subtitle}>
            Real-time feed tracking active user submissions.
          </Typography>
        </Box>

        <Badge badgeContent={notifications.length} color="error" max={99} sx={{ flexShrink: 0 }}>
          <Chip
            icon={<AnnouncementIcon />}
            label="Live"
            color="success"
            variant="outlined"
            sx={styles.liveChip}
          />
        </Badge>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ── NOTIFICATION FEED ── */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {notifications.length === 0 ? (
          <Paper variant="outlined" sx={styles.emptyState}>
            <MailIcon color="disabled" sx={{ fontSize: 42, mb: 1.5, opacity: 0.4 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
              No Live Notifications Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={styles.emptySubtext}>
              The system stream is idle. Submit a new form response on your client app to see live events.
            </Typography>
          </Paper>
        ) : (
          notifications.map((item, index) => (
            <Card key={item?.id ?? `notif-${index}`} elevation={0} sx={styles.card(index, toastOpen)}>
              <CardContent sx={styles.cardContent}>

                {/* Card Header Row */}
                <Box sx={styles.cardHeader}>

                  {/* Left: user info */}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={styles.userName}>
                      <PersonIcon color="action" sx={{ fontSize: 18, flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item?.name || 'Anonymous User'}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="primary" sx={styles.userEmail}>
                      <MailIcon sx={{ fontSize: 15, opacity: 0.8, flexShrink: 0 }} />
                      {item?.email || 'no-email@provided.com'}
                    </Typography>
                  </Box>

                  {/* Right: category chip + timestamp */}
                  <Box sx={styles.cardMeta}>
                    <Chip
                      label={item?.category || 'general'}
                      color={getCategoryColor(item?.category)}
                      size="small"
                      sx={styles.categoryChip}
                    />
                    {item?.timestamp && (
                      <Typography variant="caption" color="text.secondary" sx={styles.timestamp}>
                        <QueryBuilderIcon sx={{ fontSize: 13 }} />
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Message Body */}
                <Box sx={styles.messageBox}>
                  <Typography variant="body2" color="text.primary" sx={styles.messageText}>
                    "{item?.message || 'No notification contents available.'}"
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* ── TOAST ALERT ── */}
      <Fade in={toastOpen}>
        <Paper elevation={24} sx={styles.toastPaper}>
          <Alert
            onClose={handleToastClose}
            severity="info"
            variant="filled"
            sx={styles.toastAlert}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={styles.toastTitle}>
                🚨 Incoming Notification
              </Typography>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }} />

              <Stack spacing={0.6} sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={styles.toastMeta}>
                  Sender: <span style={{ fontWeight: 400 }}>{latestNotification?.name || 'Anonymous'}</span>
                </Typography>
                <Typography variant="body2" sx={styles.toastMeta}>
                  Email:{' '}
                  <span style={{ fontWeight: 400, textDecoration: 'underline', color: '#dbf4ff', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {latestNotification?.email || 'No email sent'}
                  </span>
                </Typography>
              </Stack>

              <Box sx={styles.toastPayload}>
                <Typography variant="caption" display="block" sx={styles.toastPayloadLabel}>
                  Content Payload:
                </Typography>
                <Typography variant="body2" sx={styles.toastPayloadText}>
                  "{latestNotification?.message || 'Empty transmission content'}"
                </Typography>
              </Box>
            </Box>
          </Alert>
        </Paper>
      </Fade>

    </Box>
  );
}

/* ── STYLES ── */
const styles = {
  root: {
    maxWidth: 720,
    mx: 'auto',
    py: { xs: 1, sm: 2 },
    px: { xs: 0.5, sm: 0 },
    position: 'relative',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 1,
    mb: 3,
    width: '100%',
  },
  title: {
    letterSpacing: -0.5,
    fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.125rem' },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    fontSize: { xs: '11px', sm: '13px', md: '14px' },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  liveChip: {
    fontWeight: 700,
    height: { xs: 26, sm: 32 },
    '& .MuiChip-label': {
      px: { xs: 1, sm: 1.5 },
      fontSize: { xs: '11px', sm: '13px' },
    },
  },
  emptyState: {
    py: { xs: 6, sm: 8 },
    px: 2,
    textAlign: 'center',
    borderRadius: 4,
    bgcolor: 'background.paper',
    borderStyle: 'dashed',
  },
  emptySubtext: {
    maxWidth: 320,
    mx: 'auto',
    mt: 0.5,
    fontSize: { xs: '11px', sm: '13px' },
  },
  card: (index, toastOpen) => ({
    borderRadius: 3,
    border: '1px solid',
    borderColor: index === 0 && toastOpen ? '#7c3aed' : 'divider',
    bgcolor: 'background.paper',
    transition: 'border-color 0.3s ease',
  }),
  cardContent: {
    p: { xs: 2, sm: 3 },
    '&:last-child': { pb: { xs: 2, sm: 3 } },
  },
  cardHeader: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'stretch', md: 'center' },
    gap: { xs: 1.5, md: 2 },
    mb: 2,
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    lineHeight: 1.2,
    fontSize: { xs: '0.95rem', sm: '1rem' },
  },
  userEmail: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontWeight: 600,
    mt: 0.5,
    fontSize: { xs: '12px', sm: '13px' },
    wordBreak: 'break-all',
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: { xs: 'space-between', md: 'flex-end' },
    gap: 1.5,
    flexShrink: 0,
    borderTop: { xs: '1px solid', md: 'none' },
    borderColor: 'action.hover',
    pt: { xs: 1, md: 0 },
  },
  categoryChip: {
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: '10px',
    height: 20,
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    fontWeight: 500,
  },
  messageBox: {
    bgcolor: 'action.hover',
    p: { xs: 1.5, sm: 2 },
    borderRadius: 2,
    borderLeft: '3px solid',
    borderColor: 'text.secondary',
  },
  messageText: {
    lineHeight: 1.5,
    fontStyle: 'italic',
    wordBreak: 'break-word',
    fontSize: { xs: '13px', sm: '14px' },
  },
  toastPaper: {
    position: 'fixed',
    bottom: { xs: 12, sm: 24 },
    right: { xs: 12, sm: 24 },
    left: { xs: 12, sm: 'auto' },
    zIndex: 9999,
    minWidth: { xs: 0, sm: 340 },
    maxWidth: { xs: '100%', sm: 400 },
    borderRadius: 3,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  },
  toastAlert: {
    width: '100%',
    borderRadius: 0,
    bgcolor: '#7c3aed',
    p: { xs: 1.75, sm: 2.5 },
  },
  toastTitle: {
    mb: 0.5,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  toastMeta: {
    fontWeight: 700,
    fontSize: '13px',
  },
  toastPayload: {
    bgcolor: 'rgba(0,0,0,0.15)',
    p: 1.25,
    borderRadius: 1.5,
  },
  toastPayloadLabel: {
    fontWeight: 800,
    opacity: 0.8,
    textTransform: 'uppercase',
    mb: 0.5,
    letterSpacing: 0.5,
    fontSize: '10px',
  },
  toastPayloadText: {
    fontSize: '12px',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontStyle: 'italic',
    wordBreak: 'break-word',
  },
};