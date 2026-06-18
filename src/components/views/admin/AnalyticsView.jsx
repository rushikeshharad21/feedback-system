import React from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useDashboardStore } from '../../../store/dashboardStore.js';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsViewPage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chartHeight = isMobile ? 300 : 350;

  const { bugs, features, praise } = useDashboardStore((state) => state.analytics || {
    bugs: 0,
    features: 0,
    praise: 0
  });

  const categoryData = [
    { name: 'Bug Reports', count: bugs, fill: '#ef4444' },
    { name: 'Feature Requests', count: features, fill: '#10b981' },
    { name: 'Praise', count: praise, fill: '#3b82f6' }
  ];

  return (
    <Paper sx={styles.panel(isDarkMode)}>
      <Typography variant="h5" sx={styles.title}>
        Real-Time Category Performance Metrics
      </Typography>
      <Typography variant="body2" sx={styles.subtitle}>
        Real-time graphical analysis showing categorization within the system.
      </Typography>

      <Box sx={styles.chartContainer}>
        <ResponsiveContainer width="99%" height={chartHeight} minWidth={0}>
          <BarChart
            data={categoryData}
            barSize={60}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? '#334155' : '#f1f5f9'}
            />
            <XAxis
              dataKey="name"
              stroke={isDarkMode ? '#94a3b8' : '#64748b'}
              tickLine={false}
              fontSize={12}
            />
            <YAxis
              stroke={isDarkMode ? '#94a3b8' : '#64748b'}
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <Tooltip
              cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc' }}
              contentStyle={styles.tooltip(isDarkMode)}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

const styles = {
  panel: (isDarkMode) => ({
    p: { xs: 2, sm: 4 },
    borderRadius: 4,
    border: '1px solid',
    borderColor: isDarkMode ? '#334155' : '#e2e8f0',
    boxShadow: 'none',
    bgcolor: 'background.paper',
    backgroundImage: 'none',
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  }),
  title: {
    fontWeight: 800,
    mb: 1,
    color: 'text.primary',
    letterSpacing: -0.5,
    fontSize: { xs: '1.25rem', sm: '1.5rem' }
  },
  subtitle: {
    color: 'text.secondary',
    mb: 4,
    fontSize: { xs: '12px', sm: '14px' }
  },
  chartContainer: {
    width: '100%',
    minWidth: 0,
  },
  tooltip: (isDarkMode) => ({
    borderRadius: '12px',
    border: 'none',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    boxShadow: isDarkMode
      ? '0 10px 15px -3px rgb(0 0 0 / 0.5)'
      : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    color: isDarkMode ? '#f8fafc' : '#0f172a'
  }),
};