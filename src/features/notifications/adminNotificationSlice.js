import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

// Async Thunks
export const fetchAdminNotificationsThunk = createAsyncThunk(
  'adminNotifications/fetchAll',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await notificationService.fetchAll(page);
      return response.data?.data ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchAdminUnreadCountThunk = createAsyncThunk(
  'adminNotifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.fetchUnreadCount();
      return response.data?.data?.unread_count ?? 0;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAdminAsReadThunk = createAsyncThunk(
  'adminNotifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAdminAsReadThunk = createAsyncThunk(
  'adminNotifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

const adminNotificationSlice = createSlice({
  name: 'adminNotifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setAdminUnreadCount: (state, action) => {
      state.unreadCount = action.payload ?? 0;
    },
    clearAdminNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAdminNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        // Recalculate unread count from full list
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(fetchAdminNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Unread Count
      .addCase(fetchAdminUnreadCountThunk.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark As Read
      .addCase(markAdminAsReadThunk.fulfilled, (state, action) => {
        const notif = state.notifications.find(n => n.id === action.payload);
        if (notif && !notif.is_read) {
          notif.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark All As Read
      .addCase(markAllAdminAsReadThunk.fulfilled, (state) => {
        state.notifications.forEach(n => n.is_read = true);
        state.unreadCount = 0;
      });
  },
});

export const { setAdminUnreadCount, clearAdminNotifications } = adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;
