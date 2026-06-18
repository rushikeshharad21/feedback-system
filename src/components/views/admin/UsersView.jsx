import React, { useMemo } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, Tooltip
} from '@mui/material';
import { useDashboardStore } from '../../../store/dashboardStore.js';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SpeakerNotesOffOutlinedIcon from "@mui/icons-material/SpeakerNotesOff";
import AutorenewIcon from "@mui/icons-material/LoopOutlined";

// ─── Helpers ────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: 'primary.main',   color: '#fff' },
  { bg: 'success.main',   color: '#fff' },
  { bg: 'warning.main',   color: '#fff' },
  { bg: 'secondary.main', color: '#fff' },
  { bg: 'error.main',     color: '#fff' },
];

function getAvatarColor(index) {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

function parseSession(createdAt) {
  const date = createdAt ? new Date(createdAt) : null;
  if (!date || isNaN(date.getTime())) {
    return { dateStr: '—', timeStr: null, relativeStr: null };
  }

  const dateStr = date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const diffMs   = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  let relativeStr = '';

  if (diffMins < 1)          relativeStr = 'just now';
  else if (diffMins < 60)    relativeStr = `${diffMins}m ago`;
  else if (diffMins < 1440)  relativeStr = `${Math.floor(diffMins / 60)}h ago`;
  else if (diffMins < 10080) relativeStr = `${Math.floor(diffMins / 1440)}d ago`;
  else                       relativeStr = dateStr;

  return { dateStr, timeStr, relativeStr };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SessionCell({ createdAt }) {
  const { dateStr, timeStr, relativeStr } = parseSession(createdAt);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12.5, color: 'text.primary', lineHeight: 1 }}>
        {dateStr}
      </Typography>
      {timeStr && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1 }}>
            {timeStr}
          </Typography>
          {relativeStr && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.3,
                px: 0.7,
                py: 0.2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '2px',
                bgcolor: (t) => t.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
              }}
            >
              <AutorenewIcon sx={{ fontSize: 10, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ fontSize: 10.5, color: 'text.secondary', lineHeight: 1 }}>
                {relativeStr}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

function ResponseCell({ responses }) {
  const lastMessage = responses?.length > 0 ? responses[responses.length - 1] : null;

  if (!lastMessage) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <SpeakerNotesOffOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled', flexShrink: 0 }} />
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.disabled', fontStyle: 'normal' }}>
          No response yet
        </Typography>
      </Box>
    );
  }

  return (
    <Tooltip
      title={
        <Typography variant="body2" sx={{ fontSize: 12.5, p: 0.5, lineHeight: 1.6 }}>
          {lastMessage}
        </Typography>
      }
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: (t) => t.palette.mode === 'light' ? '#1e293b' : '#0f172a',
            maxWidth: 320,
            borderRadius: '4px',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflow: 'hidden', cursor: 'default' }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', flexShrink: 0 }} />
        <Typography
          variant="body2"
          sx={{
            fontSize: 12.5,
            color: 'text.secondary',
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {lastMessage}
        </Typography>
      </Box>
    </Tooltip>
  );
}

// ─── Column widths ───────────────────────────────────────────────────────────

const COL_STYLES = {
  base: {
    fontWeight: 700,
    color: 'text.secondary',
    fontSize: 11,
    letterSpacing: 0.5,
    borderBottom: '2px solid',
    borderColor: 'divider',
    py: 1.5,
    bgcolor: 'background.paper',
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UsersView() {
  const feedbacks = useDashboardStore((state) => state.feedbacks) || [];

  const userRegistryData = useMemo(() => {
    const onlyUserFeedbacks = feedbacks.filter(
      (f) => f.role?.toLowerCase() !== 'admin' && f.email !== 'admin@test.com'
    );

    const userMap = {};

    onlyUserFeedbacks.forEach((f) => {
      const emailKey = f.email?.trim().toLowerCase();
      if (!emailKey) return;

      if (!userMap[emailKey]) {
        userMap[emailKey] = {
          name:      f.name || 'Anonymous User',
          email:     f.email,
          createdAt: f.createdAt,
          responses: [],
        };
      }
      if (f.message) {
        userMap[emailKey].responses.push(f.message);
      }
    });

    return Object.values(userMap);
  }, [feedbacks]);

  return (
    <Box sx={{ width: '100%', animation: 'fadeIn 0.3s ease-in-out' }}>

      {/* Header */}
      <Box sx={{ mb: 3, px: 0.5 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5, fontSize: 18 }}
        >
          User Accounts Registry
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: 13 }}>
          Real-time login timeline and response telemetry for all registered users.
        </Typography>
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          border: '1px solid',
          borderColor: (t) => t.palette.mode === 'light' ? '#e2e8f0' : '#334155',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 600,
            overflowY: 'auto',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: 6, height: 6 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: (t) => t.palette.mode === 'light' ? '#cbd5e1' : '#475569',
              borderRadius: 0,
              '&:hover': { bgcolor: (t) => t.palette.mode === 'light' ? '#94a3b8' : '#64748b' },
            },
          }}
        >
          <Table stickyHeader aria-label="user accounts table" sx={{ tableLayout: 'fixed', width: '100%', minWidth: 860 }}>

            <TableHead>
              <TableRow>
                <TableCell sx={{ ...COL_STYLES.base, width: '20%' }}>ACCOUNT USER</TableCell>
                <TableCell sx={{ ...COL_STYLES.base, width: '22%' }}>OPERATIONAL EMAIL</TableCell>
                <TableCell sx={{ ...COL_STYLES.base, width: '23%' }}>LAST ACTIVE SESSION</TableCell>
                <TableCell sx={{ ...COL_STYLES.base, width: '23%' }}>LATEST RESPONSE</TableCell>
                <TableCell align="right" sx={{ ...COL_STYLES.base, width: '12%' }}>TELEMETRY</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {userRegistryData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 10, color: 'text.secondary', fontWeight: 500, fontSize: 13.5 }}
                  >
                    No user data available.
                  </TableCell>
                </TableRow>
              ) : (
                userRegistryData.map((user, index) => {
                  const { bg, color } = getAvatarColor(index);
                  return (
                    <TableRow
                      key={`${user.email}-${index}`}
                      hover
                      sx={{
                        transition: 'background-color 0.12s ease',
                        '& td': {
                          borderBottom: '1px solid',
                          borderColor: (t) => t.palette.mode === 'light' ? '#f1f5f9' : '#334155',
                        },
                        '&:last-child td': { border: 0 },
                        '&:hover': {
                          bgcolor: (t) => t.palette.mode === 'light' ? '#f8fafc' : '#1e293b',
                        },
                      }}
                    >

                      {/* 1. User */}
                      <TableCell sx={{ py: 1.6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar
                            sx={{
                              bgcolor: bg,
                              color,
                              width: 28,
                              height: 28,
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 0,
                              flexShrink: 0,
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: 13,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* 2. Email */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 12.5,
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.email}
                        </Typography>
                      </TableCell>

                      {/* 3. Last Active Session */}
                      <TableCell sx={{ py: 1.2 }}>
                        <SessionCell createdAt={user.createdAt} />
                      </TableCell>

                      {/* 4. Latest Response */}
                      <TableCell sx={{ py: 1.2 }}>
                        <ResponseCell responses={user.responses} />
                      </TableCell>

                      {/* 5. Telemetry */}
                      <TableCell align="right">
                        <Chip
                          icon={<ForumIcon sx={{ fontSize: '11px !important', color: '#10b981 !important' }} />}
                          label={`${user.responses.length} sync`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: 10.5,
                            borderRadius: '2px',
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                          }}
                        />
                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}