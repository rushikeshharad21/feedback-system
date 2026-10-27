import React, { useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client'; 
import { useDashboardStore } from './store/dashboardStore.js';
import { getBackendUrl } from './config.js';

// 🛡️ Error Boundary पॅकेज आणि Fallback कॉम्पोनंट
import ErrorFallback from "./components/ErrorFallback.jsx";
import { ErrorBoundary } from 'react-error-boundary';
import {Box} from "@mui/material"
import LoginView from './components/views/LoginView.jsx';
import AdminDashboard from './layouts/AdminDashboard.jsx';
import UserDashboard from './layouts/UserDashboard.jsx';
import DashboardHomeFeed from './components/views/admin/DashboardHomefeed.jsx';
import AnalyticsViewPage from './components/views/admin/AnalyticsView.jsx';
import UsersView from './components/views/admin/UsersView.jsx';
import SettingsView from './components/views/admin/SettingsView.jsx';
import SettingsPage from "./components/views/admin/settingsPage.jsx";

const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#7c3aed' },
    secondary: { main: '#38bdf8' },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper:   mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary:   mode === 'light' ? '#0f172a' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    }
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Plus Jakarta Sans, Roboto, sans-serif' }
});

export default function App() {
  const currentUser = useDashboardStore((state) => state.currentUser);
  const themeMode   = useDashboardStore((state) => state.themeMode);
  const userRole    = currentUser?.role ? String(currentUser.role).trim().toLowerCase() : '';

  // ── STORE ACTIONS FOR REAL-TIME SYNC ──
  const addNotification = useDashboardStore((state) => state.addNotification);
  const injectRealFeedback = useDashboardStore((state) => state.injectRealFeedback);

  // Themes memorization
  const loginTheme     = useMemo(() => buildTheme('light'), []);
  const dashboardTheme = useMemo(() => buildTheme(themeMode), [themeMode]);

  // ── ⚡ SOCKET.IO REAL-TIME CONNECTION EFFECT ──
  useEffect(() => {
    if (!currentUser) return;

    const socket = io(getBackendUrl(), {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    if (userRole === 'admin') {
      socket.emit('join-room', 'admin');
      console.log("🛡️ Client requesting to join admin WebSocket room...");
    }

    socket.on('admin-notification', (data) => {
      console.log("🚨 Live admin notification packet caught:", data);
      if (addNotification) addNotification(data);
    });

    socket.on('feedback-updated', (allFeedbacks) => {
      console.log("📊 Global feedback state updated from cluster");
      if (allFeedbacks && allFeedbacks.length > 0 && injectRealFeedback) {
        injectRealFeedback(allFeedbacks[0]); 
      }
    });

    return () => {
      socket.off('admin-notification');
      socket.off('feedback-updated');
      socket.disconnect();
      console.log("🔌 Socket lifecycle cleaner executed.");
    };
  }, [currentUser, userRole, addNotification, injectRealFeedback]);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 PUBLIC ROUTE: LOGIN */}
        <Route
          path="/login"
          element={
            !currentUser ? (
              <ThemeProvider theme={loginTheme}>
                <CssBaseline />
                <LoginView />
              </ThemeProvider>
            ) : (
              // जर युझर आधीच लॉग-इन असेल, तर त्याला थेट होम पाथवर पाठवा
              <Navigate to="/" replace />
            )
          }
        />

        {/* ⚡ PROTECTED ROUTE STRUCTURE */}
        <Route
          path="/"
          element={
            !currentUser ? (
              // जर सेशन नसेल, तर बंधनकारकपणे लॉगिनवर पाठवा
              <Navigate to="/login" replace />
            ) : (
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
                <ThemeProvider theme={dashboardTheme}>
                  <CssBaseline />
                  {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
                </ThemeProvider>
              </ErrorBoundary>
            )
          }
        >
          {/* ॲडमिनसाठीचे नेस्टेड सब-रूट्स */}
          {userRole === 'admin' && (
            <>
              {/* मुख्य पाथ उघडल्यावर थेट होम फीड लोड होईल */}
              <Route index element={<DashboardHomeFeed />} />
              <Route path="analytics" element={<AnalyticsViewPage />} />
              <Route path="users" element={<UsersView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="setter"  element={<SettingsPage/>}/>
            </>
          )}

          {/* युझर रोलसाठीचा डिफॉल्ट सब-रूट (जर आवश्यक असेल तर) */}
          {userRole !== 'admin' && (
            <Route index element={<Box p={3}>User Dashboard Content</Box>} />
          )}
        </Route>

        {/* 🔄 GLOBAL FALLBACK */}
        <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />

      </Routes>
    </BrowserRouter>
  );
}