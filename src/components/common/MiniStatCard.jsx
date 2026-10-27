import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function MiniStatCard({ title, value, icon, iconBg, trend, isPositive }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        bgcolor: isDarkMode ? 'rgba(30, 41, 59, 0.65)' : '#ffffff',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDarkMode 
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.35)' 
          : '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: isDarkMode ? 'rgba(56, 189, 248, 0.35)' : 'rgba(124, 58, 237, 0.25)',
          boxShadow: isDarkMode
            ? '0 12px 28px -4px rgba(0, 0, 0, 0.5)'
            : '0 12px 28px -4px rgba(124, 58, 237, 0.08)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ minWidth: 0, pr: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: isDarkMode ? '#94a3b8' : '#64748b',
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                fontSize: '11px',
                display: 'block'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                mt: 0.75,
                letterSpacing: -0.7,
                fontSize: { xs: '1.75rem', sm: '2rem' },
                lineHeight: 1.1
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: iconBg || (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9'),
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              transition: 'transform 0.2s ease',
              '& svg': { fontSize: 22 }
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pt: 1, borderTop: '1px solid', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                bgcolor: isPositive 
                  ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                  : (isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'),
                color: isPositive ? '#10b981' : '#ef4444'
              }}
            >
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '11px' }}>
                {trend}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: isDarkMode ? '#64748b' : '#94a3b8', fontSize: '11px', fontWeight: 500 }}>
              this month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}