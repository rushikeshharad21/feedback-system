import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function MiniStatCard({ title, value, icon, iconBg, trend, isPositive }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 'none',
        border: '1px solid',
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        bgcolor: 'background.paper',
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode
            ? '0 12px 20px -5px rgb(0 0 0 / 0.3)'
            : '0 12px 20px -5px rgb(0 0 0 / 0.05)'
        }
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 800,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                display: 'block'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: 'text.primary',
                mt: 1,
                mb: 1,
                letterSpacing: -0.5,
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {value}
            </Typography>

            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{ color: isPositive ? '#10b981' : '#ef4444', fontWeight: 700 }}
                >
                  {trend}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', ml: 0.5 }}>
                  this month
                </Typography>
              </Box>
            )}
          </Box>

          <Avatar
            sx={{
              bgcolor: iconBg || (isDarkMode ? '#1e293b' : '#f1f5f9'),
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: 3,
              flexShrink: 0
            }}
          >
            {icon}
          </Avatar>

        </Box>
      </CardContent>
    </Card>
  );
}