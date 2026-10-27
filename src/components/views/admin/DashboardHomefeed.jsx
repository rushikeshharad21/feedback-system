import React from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery, Chip, Avatar, Rating } from '@mui/material';
import { useDashboardStore } from '../../../store/dashboardStore.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MiniStatCard from '../../common/MiniStatCard.jsx';

import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import StarsIcon from '@mui/icons-material/Stars';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PersonIcon from '@mui/icons-material/Person';

export default function DashboardHomeFeed() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chartHeight = isMobile ? 260 : 340;

  const feedbacks = useDashboardStore((state) => state.feedbacks) || [];

  const { total, avgRating, bugs, features, chartData } = useDashboardStore(
    (state) => state.analytics || { total: 0, avgRating: 0, bugs: 0, features: 0, chartData: [] }
  );

  const getCategoryBadge = (category) => {
    const cat = (category || 'general').toLowerCase();
    if (cat === 'bug') {
      return { label: 'Bug Report', color: '#ef4444', bg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)' };
    }
    if (cat === 'feature') {
      return { label: 'Feature Request', color: '#3b82f6', bg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' };
    }
    if (cat === 'praise') {
      return { label: 'Praise', color: '#10b981', bg: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)' };
    }
    return { label: 'General', color: '#8b5cf6', bg: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)' };
  };

  return (
    <Box sx={styles.container}>

      {/* ── HEADER ── */}
      <Box sx={styles.headerRow}>
        <Box>
          <Typography variant="h5" sx={styles.headerTitle(isDarkMode)}>
            Operational Overview
          </Typography>
          <Typography variant="body2" sx={styles.headerSubtitle(isDarkMode)}>
            Real-time system telemetry and customer feedback metrics
          </Typography>
        </Box>

        <Chip
          icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: '#10b981 !important', animation: 'pulse 2s infinite' }} />}
          label="Live Stream Active"
          size="small"
          sx={styles.liveChip(isDarkMode)}
        />
      </Box>

      {/* ── STATS CARDS (4-COLUMN BALANCED CSS GRID) ── */}
      <Box sx={styles.statsGrid}>
        <MiniStatCard
          title="Total Feedbacks"
          value={total}
          trend="+12.5%"
          isPositive={true}
          icon={<AssessmentIcon sx={{ color: '#3b82f6' }} />}
          iconBg={isDarkMode ? 'rgba(59, 130, 246, 0.18)' : '#eff6ff'}
        />

        <MiniStatCard
          title="Average Rating"
          value={`${avgRating} / 5`}
          trend="+4.2%"
          isPositive={true}
          icon={<StarsIcon sx={{ color: '#eab308' }} />}
          iconBg={isDarkMode ? 'rgba(234, 179, 8, 0.18)' : '#fef9c3'}
        />

        <MiniStatCard
          title="Active Bugs"
          value={bugs}
          trend={bugs > 0 ? "Action Required" : "System Stable"}
          isPositive={bugs === 0}
          icon={<BugReportIcon sx={{ color: '#ef4444' }} />}
          iconBg={isDarkMode ? 'rgba(239, 68, 68, 0.18)' : '#fef2f2'}
        />

        <MiniStatCard
          title="Feature Requests"
          value={features}
          trend="+8.3%"
          isPositive={true}
          icon={<RateReviewIcon sx={{ color: '#10b981' }} />}
          iconBg={isDarkMode ? 'rgba(16, 185, 129, 0.18)' : '#f0fdf4'}
        />
      </Box>

      {/* ── GROWTH ANALYTICS CHART ── */}
      <Paper elevation={0} sx={styles.chartPanel(isDarkMode)}>
        <Box sx={styles.chartHeader}>
          <Box>
            <Typography variant="h6" sx={styles.panelTitle(isDarkMode)}>
              Monthly Growth Analytical Stream
            </Typography>
            <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Aggregated incoming feedback volume across the timeline
            </Typography>
          </Box>
          <Chip label="2026 Volume" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '11px', height: 24 }} />
        </Box>

        <Box sx={{ width: '100%', minWidth: 0, mt: 3 }}>
          <ResponsiveContainer width="99%" height={chartHeight} minWidth={0}>
            <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={isDarkMode ? 0.35 : 0.45} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
              <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={styles.chartTooltip(isDarkMode)} />
              <Area type="monotone" dataKey="feedbacks" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorFeed)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* ── RECENT OPERATIONAL STREAMS ── */}
      <Paper elevation={0} sx={styles.activityPanel(isDarkMode)}>
        <Box sx={styles.activityPanelHeader}>
          <Typography variant="h6" sx={styles.panelTitle(isDarkMode)}>
            Live Operational Streams
          </Typography>
          <Typography variant="caption" sx={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
            Showing recent submissions
          </Typography>
        </Box>

        {(!feedbacks || feedbacks.length === 0) ? (
          <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No feedback records found yet.</Typography>
          </Box>
        ) : (
          feedbacks.slice(0, 5).map((f, i) => {
            const badge = getCategoryBadge(f.category);
            return (
              <Box key={f._id || i} sx={styles.activityItem(isDarkMode, badge.color)}>
                <Box sx={styles.activityLeft}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: isDarkMode ? '#f8fafc' : '#334155' }}>
                    <PersonIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                        {f.name || 'Anonymous User'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                        {f.email}
                      </Typography>
                      <Chip
                        label={badge.label}
                        size="small"
                        sx={{
                          bgcolor: badge.bg,
                          color: badge.color,
                          fontWeight: 700,
                          fontSize: '10px',
                          height: 20
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: isDarkMode ? '#cbd5e1' : '#475569', mt: 0.5, lineHeight: 1.5 }}>
                      "{f.message}"
                    </Typography>
                  </Box>
                </Box>

                <Box sx={styles.activityRight}>
                  <Rating value={Number(f.rating) || 5} readOnly size="small" />
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8', fontWeight: 500 }}>
                    {f.createdAt ? new Date(f.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Paper>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    animation: 'fadeIn 0.25s ease-in-out',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 1.5,
    mb: 3.5,
  },
  headerTitle: (isDarkMode) => ({
    fontWeight: 900,
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    letterSpacing: -0.5,
    fontSize: { xs: '1.4rem', sm: '1.75rem' },
  }),
  headerSubtitle: (isDarkMode) => ({
    color: isDarkMode ? '#94a3b8' : '#64748b',
    mt: 0.25,
    fontSize: '13px',
  }),
  liveChip: (isDarkMode) => ({
    bgcolor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
    color: '#10b981',
    fontWeight: 700,
    fontSize: '12px',
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
    height: 28,
  }),
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      lg: 'repeat(4, 1fr)'
    },
    gap: { xs: 2, sm: 2.5, md: 3 },
    mb: 4,
    width: '100%'
  },
  chartPanel: (isDarkMode) => ({
    p: { xs: 2.5, sm: 3.5 },
    borderRadius: '16px',
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    boxShadow: isDarkMode ? '0 4px 20px -2px rgba(0, 0, 0, 0.35)' : '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
    mb: 4,
    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.65)' : '#ffffff',
    backdropFilter: 'blur(16px)',
  }),
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  panelTitle: (isDarkMode) => ({
    fontWeight: 800,
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    fontSize: '16px',
    letterSpacing: -0.3,
  }),
  chartTooltip: (isDarkMode) => ({
    borderRadius: '10px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600
  }),
  activityPanel: (isDarkMode) => ({
    p: { xs: 2.5, sm: 3.5 },
    borderRadius: '16px',
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    boxShadow: isDarkMode ? '0 4px 20px -2px rgba(0, 0, 0, 0.35)' : '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
    bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.65)' : '#ffffff',
    backdropFilter: 'blur(16px)',
  }),
  activityPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2.5,
  },
  activityItem: (isDarkMode, accentColor) => ({
    p: 2,
    mb: 1.5,
    borderRadius: '12px',
    bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc',
    border: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid ${accentColor || '#38bdf8'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 1.5,
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.7)' : '#f1f5f9',
      transform: 'translateX(2px)',
    },
    '&:last-child': { mb: 0 },
  }),
  activityLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.75,
    minWidth: 0,
    flex: 1,
  },
  activityRight: {
    display: 'flex',
    flexDirection: { xs: 'row', sm: 'column' },
    alignItems: { xs: 'center', sm: 'flex-end' },
    justifyContent: 'space-between',
    width: { xs: '100%', sm: 'auto' },
    gap: 0.5,
    flexShrink: 0,
  },
};