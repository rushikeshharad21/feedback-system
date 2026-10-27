import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, Button, Divider, IconButton, Badge,
  Popover, Stack, Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { useDashboardStore } from '../store/dashboardStore.js';

const drawerWidth = 260;

const getCategoryColor = (cat) => {
  switch (cat?.toLowerCase()) {
    case 'bug':     return 'error';
    case 'feature': return 'info';
    case 'praise':  return 'success';
    default:        return 'default';
  }
};

export default function AdminDashboard() {
  const { logoutUser, themeMode, toggleTheme, fetchInitialFeedbacks } = useDashboardStore();
  const notifications = useDashboardStore((state) => state.notifications || []);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [anchorEl, setAnchorEl]       = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenIdRef                 = useRef(null); 

  // १. लाईव्ह डेटा सिंक (प्रोजेक्ट लोड होताना एकदाच रन होईल)
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchInitialFeedbacks();
    }
    return () => { isMounted = false; };
  }, [fetchInitialFeedbacks]);

  // २. ✅ दुरुस्त केले: इन्फिनिट लूप टाळण्यासाठी डिपेन्डेन्सीमधून anchorEl काढून टाकले
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    
    const newest = notifications[0];
    if (newest?.id && newest.id !== lastSeenIdRef.current) {
      lastSeenIdRef.current = newest.id;
      setUnreadCount((prev) => prev + 1);
    }
  }, [notifications]); // ⚡ anchorEl काढून केवळ 'notifications' वर लक्ष ठेवले

  const handleBellOpen  = (e) => { 
    setAnchorEl(e.currentTarget); 
    setUnreadCount(0); // पोपओवर उघडताच अनरीड काउंट ० करा
  };
  
  const handleBellClose = () => setAnchorEl(null);
  const popoverOpen     = Boolean(anchorEl);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // ३. ✅ दुरुस्त केले: नेस्टेड रूट्स डॅशबोर्डच्या आत उघडण्यासाठी पाथ रिलेटिव्ह (Relative) केले
  const menuItems = useMemo(() => [
    { text: 'Home Feed',     icon: <DashboardIcon />,         path: '/'          },
    { text: 'Analytics',     icon: <BarChartIcon />,          path: 'analytics'  }, // स्लॅश काढला
    { text: 'User Database', icon: <PeopleIcon />,           path: 'users'      }, // स्लॅश काढला
    { text: 'Notifications', icon: <NotificationsIcon />,    path: 'settings'   }, // स्लॅश काढला
    { text: 'System Audit',  icon: <SettingsTwoToneIcon />,  path: 'setter'     }  // स्लॅश काढला
  ], []);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: (t) => t.palette.mode === 'dark' ? '#0b0f19' : '#ffffff' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '16px'
          }}>
            ⚡
          </Box>
          <Typography variant="h6" sx={{ color: (t) => t.palette.mode === 'dark' ? '#f8fafc' : '#0f172a', fontWeight: 900, letterSpacing: -0.5, fontSize: '1.15rem' }}>
            Feedback<span style={{ color: '#38bdf8' }}>OS</span>
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'divider' }} />
      <List sx={{ px: 1.5, mt: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.includes(item.path);
            
          return (
            <ListItemButton
              key={item.text}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                mb: 0.75,
                borderRadius: '10px',
                bgcolor: isActive 
                  ? (themeMode === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(124, 58, 237, 0.1)') 
                  : 'transparent',
                color: isActive 
                  ? (themeMode === 'dark' ? '#38bdf8' : '#7c3aed') 
                  : (themeMode === 'dark' ? '#94a3b8' : '#64748b'),
                borderLeft: isActive 
                  ? (themeMode === 'dark' ? '3px solid #38bdf8' : '3px solid #7c3aed') 
                  : '3px solid transparent',
                py: 1,
                px: 1.5,
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  bgcolor: isActive 
                    ? (themeMode === 'dark' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(124, 58, 237, 0.15)') 
                    : (themeMode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                  color: isActive 
                    ? (themeMode === 'dark' ? '#38bdf8' : '#7c3aed') 
                    : (themeMode === 'dark' ? '#f8fafc' : '#0f172a'),
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 20 } }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{ primary: { sx: { fontWeight: isActive ? 700 : 600, fontSize: '0.875rem' } } }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>

      {/* ── APP BAR ── */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.8)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mr: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 1, sm: 2 }, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: -0.4, fontSize: { xs: '1rem', sm: '1.15rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              Feedback Management Console
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0, ml: 'auto' }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                p: { xs: 0.75, sm: 1 }, bgcolor: 'action.hover',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              {themeMode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>

            {/* Notification Bell */}
            <IconButton
              onClick={handleBellOpen}
              color="inherit"
              aria-label="notifications"
              sx={{
                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                p: { xs: 0.75, sm: 1 }, bgcolor: 'action.hover',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <Badge badgeContent={unreadCount} color="error" max={99}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>

            {/* Notification Popover Stream */}
            <Popover
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={handleBellClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.5,
                    width: { xs: 320, sm: 380 },
                    maxHeight: 480,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: (t) => t.palette.mode === 'dark'
                      ? '0 16px 40px rgba(0,0,0,0.6)'
                      : '0 16px 40px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              }}
            >
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: -0.3 }}>
                  Live Notifications
                </Typography>
                <Chip label={`${notifications.length} total`} size="small" sx={{ fontWeight: 700, fontSize: '11px', height: 20 }} />
              </Box>

              <Box sx={{ overflowY: 'auto', flex: 1 }}>
                {notifications.length === 0 ? (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <MailIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      No notifications yet
                    </Typography>
                  </Box>
                ) : (
                  <Stack divider={<Divider />}>
                    {notifications.slice(0, 10).map((item, index) => {
                      const uniqueKey = item.id ? `notif-${item.id}` : `notif-idx-${index}`;
                      return (
                        <Box
                          key={uniqueKey}
                          sx={{
                            px: 2.5, py: 1.75,
                            borderLeft: '3px solid',
                            borderColor: item.category?.toLowerCase() === 'bug'
                              ? 'error.main'
                              : item.category?.toLowerCase() === 'feature'
                                ? 'info.main'
                                : 'success.main',
                            transition: 'background-color 0.15s',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, overflow: 'hidden' }}>
                              <PersonIcon sx={{ fontSize: 15, flexShrink: 0, color: 'text.secondary' }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name || 'Anonymous'}
                              </span>
                            </Typography>
                            <Chip label={item.category || 'general'} color={getCategoryColor(item.category)} size="small" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', height: 18, flexShrink: 0 }} />
                          </Box>

                          <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, wordBreak: 'break-all' }}>
                            <MailIcon sx={{ fontSize: 12, flexShrink: 0 }} />
                            {item.email}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5, fontSize: '12px' }}>
                            "{item.message}"
                          </Typography>

                          {item.timestamp && (
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
                              <QueryBuilderIcon sx={{ fontSize: 12 }} />
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              {notifications.length > 0 && (
                <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={700}
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => { handleBellClose(); navigate('settings'); }} // ✅ स्लॅश काढला
                  >
                    View all notifications →
                  </Typography>
                </Box>
              )}
            </Popover>

            {/* Logout */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              endIcon={<ExitToAppIcon />}
              onClick={logoutUser}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: 1.75, sm: 2.25 },
                py: { xs: 0.5, sm: 0.75 },
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.4)',
                '&:hover': {
                  borderColor: 'error.main',
                  bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── DRAWER ── */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: (t) => t.palette.mode === 'dark' ? '#0b0f19' : '#ffffff',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none'
            }
          }}
        >
          {drawerContent}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: (t) => t.palette.mode === 'dark' ? '#0b0f19' : '#ffffff',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none'
            }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* ── MAIN CONTENT AREA ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0,
          boxSizing: 'border-box',
          mt: { xs: 7, sm: 8 }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}