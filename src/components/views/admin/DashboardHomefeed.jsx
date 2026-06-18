import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useDashboardStore } from '../../../store/dashboardStore.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MiniStatCard from '../../common/MiniStatCard.jsx';

import AssessmentIcon from '@mui/icons-material/Assessment';
import BugReportIcon from '@mui/icons-material/BugReport';
import StarsIcon from '@mui/icons-material/Stars';
import RateReviewIcon from '@mui/icons-material/RateReview';

export default function DashboardHomeFeed() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chartHeight = isMobile ? 240 : 320;

  const feedbacks = useDashboardStore((state) => state.feedbacks);

  const { total, avgRating, bugs, features, chartData } = useDashboardStore(
    (state) => state.analytics || { total: 0, avgRating: 0, bugs: 0, features: 0, chartData: [] }
  );

  return (
    <Box sx={styles.container}>

      <Typography variant="h5" sx={styles.header}>
        Operational Overview
      </Typography>

      <Grid container spacing={3} sx={styles.gridContainer}>
        <Grid item xs={12} sm={6} md={3}>
          <MiniStatCard
            title="Total Feedbacks"
            value={total}
            trend="+12.5%"
            isPositive={true}
            icon={<AssessmentIcon sx={{ color: '#3b82f6' }} />}
            iconBg={isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MiniStatCard
            title="Average Rating"
            value={`${avgRating} / 5`}
            trend="+4.2%"
            isPositive={true}
            icon={<StarsIcon sx={{ color: '#eab308' }} />}
            iconBg={isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#fef9c3'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MiniStatCard
            title="Active Bugs"
            value={bugs}
            trend={bugs > 0 ? "Action Required" : "System Stable"}
            isPositive={bugs === 0}
            icon={<BugReportIcon sx={{ color: '#ef4444' }} />}
            iconBg={isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MiniStatCard
            title="Feature Requests"
            value={features}
            trend="+8.3%"
            isPositive={true}
            icon={<RateReviewIcon sx={{ color: '#10b981' }} />}
            iconBg={isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4'}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={styles.chartPanel(isDarkMode)}>
        <Typography variant="h6" sx={styles.panelTitle}>
          Monthly Growth Analytical Stream
        </Typography>
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <ResponsiveContainer width="99%" height={chartHeight} minWidth={0}>
            <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={isDarkMode ? 0.2 : 0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
              <YAxis stroke={isDarkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={styles.chartTooltip(isDarkMode)} />
              <Area type="monotone" dataKey="feedbacks" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorFeed)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper elevation={0} sx={styles.activityPanel(isDarkMode)}>
        <Typography variant="h6" sx={styles.panelTitle}>
          Live Operational Streams (Recent 5)
        </Typography>
        {(feedbacks || []).slice(0, 5).map((f, i) => (
          <Box key={i} sx={styles.activityItem(isDarkMode, f.category)}>
            <Box sx={styles.activityHeader}>
              <Typography variant="subtitle2" sx={styles.activityAuthor}>
                {f.name} ({f.email})
              </Typography>
              <Typography variant="caption" sx={styles.activityRating(isDarkMode)}>
                Rating: {f.rating} ⭐
              </Typography>
            </Box>
            <Typography variant="body2" sx={styles.activityMessage}>
              {f.message}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

const styles = {
  container: {
    width: '100%',
    animation: 'fadeIn 0.25s ease-in-out',
  },
  header: {
    fontWeight: 900,
    mb: 3,
    color: 'text.primary',
    letterSpacing: -0.8,
    textTransform: 'uppercase',
    fontSize: '22px',
  },
  gridContainer: {
    mb: 4,
  },
  panelTitle: {
    fontWeight: 800,
    mb: 3,
    color: 'text.primary',
    fontSize: '15px',
    letterSpacing: -0.3,
  },
  chartPanel: (isDarkMode) => ({
    p: 3,
    borderRadius: '0px',
    border: '1px solid',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    boxShadow: 'none',
    mb: 4,
    bgcolor: 'background.paper',
  }),
  chartTooltip: (isDarkMode) => ({
    borderRadius: '0px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
    color: isDarkMode ? '#f8fafc' : '#0f172a',
  }),
  activityPanel: (isDarkMode) => ({
    p: 3,
    borderRadius: '0px',
    border: '1px solid',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    boxShadow: 'none',
    bgcolor: 'background.paper',
  }),
  activityItem: (isDarkMode, category) => ({
    p: 2,
    mb: 1.5,
    borderRadius: '0px',
    bgcolor: isDarkMode ? '#1e293b' : '#f8fafc',
    borderLeft: `5px solid ${category === 'Bug' ? '#ef4444' : '#10b981'}`,
    borderTop: isDarkMode ? '1px solid #334155' : 'none',
    borderRight: isDarkMode ? '1px solid #334155' : 'none',
    borderBottom: isDarkMode ? '1px solid #334155' : 'none',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      bgcolor: isDarkMode ? '#334155' : '#f1f5f9',
    },
    '&:last-child': { mb: 0 },
  }),
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 0.5,
    flexWrap: 'wrap',
    gap: 1,
  },
  activityAuthor: {
    fontWeight: 800,
    color: 'text.primary',
  },
  activityRating: (isDarkMode) => ({
    color: isDarkMode ? '#94a3b8' : '#64748b',
    fontWeight: 700,
  }),
  activityMessage: {
    color: 'text.secondary',
    fontWeight: 500,
  },
};