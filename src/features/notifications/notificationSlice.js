import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [], // Persistent notifications (bell center)
  toasts: [],        // Transient toasts
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // For the Notification Center (Persistent)
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    // For Toasts (Transient)
    addToast: (state, action) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        type: action.payload.type || 'info', // 'success', 'error', 'info', 'warning'
        message: action.payload.message,
        duration: action.payload.duration || 3000
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

export const { 
  setNotifications, 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  removeNotification,
  addToast,
  removeToast
} = notificationSlice.actions;

export default notificationSlice.reducer;
