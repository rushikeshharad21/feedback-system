import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { io } from 'socket.io-client';

let socket;
const getSocket = () => {
  if (!socket) {
    socket = io('https://feedback-system-production-ec93.up.railway.app', {
      transports: ['polling','websocket'],
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
const _socket = getSocket();

export const calculateAnalytics = (feedbacks) => {
  if (!Array.isArray(feedbacks)) return { total: 0, avgRating: 0, bugs: 0, features: 0, praise: 0, chartData: [] };
  
  const total = feedbacks.length;
  const avgRating = total ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / total).toFixed(1) : 0;
  const bugs     = feedbacks.filter((f) => f.category?.toLowerCase() === 'bug').length;
  const features = feedbacks.filter((f) => f.category?.toLowerCase() === 'feature').length;
  const praise   = feedbacks.filter((f) => f.category?.toLowerCase() === 'praise').length;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyMap = {};
  feedbacks.forEach((f) => {
    const date = f.createdAt ? new Date(f.createdAt) : new Date();
    const monthName = months[date.getMonth()];
    monthlyMap[monthName] = (monthlyMap[monthName] || 0) + 1;
  });
  return { total, avgRating, bugs, features, praise, chartData: months.map((m) => ({ month: m, feedbacks: monthlyMap[m] || 0 })) };
};

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      currentUser: null, 
      feedbacks: [],
      auditLogs: [], 
      analytics: { total: 0, avgRating: 0, bugs: 0, features: 0, praise: 0, chartData: [] },
      notifications: [],
      themeMode: 'light',

      toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
      clearNotifications: () => set({ notifications: [] }),
      
      setCurrentUser: (user) => {
        console.log("Setting current user in store:", user);
        set({ currentUser: user });
      },

      logoutUser: () => {
        console.log("User logging out...");
        set({ currentUser: null });
        localStorage.removeItem('feedback-secure-storage');
      },

      // ── LIVE NOTIFICATION ACTION FIXED FOR SETTINGSVIEW ──
      addNotification: (payload) => {
        set((state) => {
          const newNotif = {
            id: payload.id || payload._id || String(Date.now() + Math.random()),
            name: payload.name || 'Anonymous User',
            email: payload.email || 'no-email@provided.com',
            category: payload.category || 'general',
            message: payload.message || 'No notification contents available.',
            timestamp: payload.createdAt || payload.timestamp || new Date().toISOString()
          };
          return { 
            notifications: [newNotif, ...state.notifications].slice(0, 50)
          };
        });
      },

      // ── LIVE API INTEGRATION WITH FALLBACK ──
      fetchInitialFeedbacks: async () => {
        try {
          console.log("Initializing core operational sync with backend...");
          get().pushAuditLog('SYNC_START', 'Fetching collection array from backend API.', 'Database Engine');
          
          const response = await fetch('https://feedback-system-production-ec93.up.railway.app/api/feedback', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
          let data = await response.json();
          
          if (!data || data.length === 0) {
            data = [
              { _id: '1', name: 'Rushi Harad', email: 'rushi@dev.io', category: 'feature', rating: 5, message: 'System connected successfully!', createdAt: new Date().toISOString() }
            ];
          }
          
          set({ feedbacks: data, analytics: calculateAnalytics(data) });
          get().pushAuditLog('SYNC_SUCCESS', `Successfully synced ${data.length} records.`, 'Store Middleware');
        } catch (error) {
          console.error("Failed to sync store state from API, running offline simulation:", error);
          get().pushAuditLog('SYNC_ERROR', `Operational fetch failure: ${error.message}`, 'Store Middleware');
          
          const fallbackData = get().feedbacks?.length ? get().feedbacks : [
            { _id: 'mock-1', name: 'Offline Simulation', email: 'watchdog@system.io', category: 'praise', rating: 4, message: 'Running in standalone offline mode.', createdAt: new Date().toISOString() }
          ];
          set({ feedbacks: fallbackData, analytics: calculateAnalytics(fallbackData) });
        }
      },
      
      pushAuditLog: (action, description, source = 'Client Engine') => {
        const newLog = {
          id: String(Date.now() + Math.random()),
          action,
          description,
          source,
          timestamp: new Date().toISOString()
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs].slice(0, 50) })); 
      },

      injectRealFeedback: (feedbackItem) => {
        set((state) => {
          const nextFeedbacks = [feedbackItem, ...state.feedbacks];
          return { feedbacks: nextFeedbacks, analytics: calculateAnalytics(nextFeedbacks) };
        });
      }
    }),
    {
      name: 'feedback-secure-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentUser: state.currentUser, themeMode: state.themeMode }),
    }
  )
);