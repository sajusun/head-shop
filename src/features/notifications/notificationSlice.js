import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Normalise API notification (is_read → read) */
const normalise = (n) => ({
  ...n,
  read: Boolean(n.is_read),
});

// ─────────────────────────────────────────────
// Async Thunks
// ─────────────────────────────────────────────

export const fetchNotificationsThunk = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.fetchAll();
      return (res.data?.data ?? []).map(normalise);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch notifications');
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to mark as read');
    }
  }
);

export const markAllAsReadThunk = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to mark all as read');
    }
  }
);

export const deleteNotificationThunk = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete notification');
    }
  }
);

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────

const initialState = {
  notifications: [],  // Persistent notifications (bell center)
  toasts: [],         // Transient toasts
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Used by the polling hook to update badge count efficiently
    setUnreadCount: (state, action) => {
      state.unreadCount = Number(action.payload ?? 0);
    },

    // Legacy local-only actions (still supported)
    setNotifications: (state, action) => {
      state.notifications = action.payload.map(n => ({ ...n, read: Boolean(n.is_read ?? n.read) }));
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
    addNotification: (state, action) => {
      const n = { ...action.payload, read: Boolean(action.payload.is_read ?? action.payload.read) };
      state.notifications.unshift(n);
      if (!n.read) state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        n.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; n.is_read = true; });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.read) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount   = 0;
    },

    // Toast actions
    addToast: (state, action) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        type:     action.payload.type     || 'info',
        message:  action.payload.message,
        duration: action.payload.duration || 4000,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading       = false;
        state.notifications = action.payload;
        state.unreadCount   = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // markAsRead
    builder.addCase(markAsReadThunk.fulfilled, (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.read) {
        n.read    = true;
        n.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // markAllAsRead
    builder.addCase(markAllAsReadThunk.fulfilled, (state) => {
      state.notifications.forEach(n => { n.read = true; n.is_read = true; });
      state.unreadCount = 0;
    });

    // delete
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n && !n.read) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    });
  },
});

export const {
  setUnreadCount,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  addToast,
  removeToast,
} = notificationSlice.actions;

export default notificationSlice.reducer;
